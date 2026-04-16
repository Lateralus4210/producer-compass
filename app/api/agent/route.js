/**
 * Next.js API Route — FP Agent
 * POST /api/agent
 *
 * Receives conversation state, injects Skill Tree context + contact profile into
 * system prompt, calls Claude API, returns assistant response.
 *
 * Contact files in contacts/{slug}.md are the single source of truth for all
 * user data. KV is a thin email→slug index only.
 *
 * Payload: { email, scores: number[10], selectedAnswer, messages: [{role, content}] }
 *
 * Contact context flow:
 *   1. Look up slug in KV by email
 *   2. Fetch contacts/{slug}.md from GitHub (24h TTL cached in KV)
 *   3. Inject frontmatter (structured) + body (narrative) into system prompt
 *   4. Claude may emit a {"_ctx":{...}} block at end of response to signal updates
 *   5. Route strips that block, writes updates back to the contact file + feed
 *
 * Response includes { message, saved?, wins?, homework?, level? } so the UI can
 * show a "progress saved" indicator when something was persisted.
 *
 * Env vars required:
 *   ANTHROPIC_API_KEY
 *   KV_REST_API_URL / KV_REST_API_TOKEN   (Upstash — index + cache only)
 *   GITHUB_TOKEN                           (fine-grained PAT, read+write Contents)
 *   GITHUB_CONTACTS_REPO                   (e.g. Lateralus4210/the-free-producer)
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { loadContact, saveContact, applyUpdate, buildFeedEvents, parseContact } from '../../../lib/contact.js';
import { ghAppendJsonl } from '../../../lib/github.js';

// ─── Static context ───────────────────────────────────────────────────────────

function loadFpContext() {
  try {
    return readFileSync(join(process.cwd(), 'lib/fp-context.md'), 'utf8');
  } catch {
    return '';
  }
}

const FP_CONTEXT = loadFpContext();

const AREA_KEYS = [
  'Composition', 'Music Theory', 'DAW Proficiency', 'Mixing', 'Mastering',
  'Collaboration', 'Artwork/Content', 'Release Process', 'Ideation', 'Promo',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PROFILE_TTL_MS = 24 * 60 * 60 * 1000;

// ─── KV helpers (index + cache only) ─────────────────────────────────────────

async function kvGet(key) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return null;
  const res = await fetch(`${KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  const { result } = await res.json();
  if (!result) return null;
  try { return JSON.parse(result); } catch { return result; }
}

async function kvSet(key, value) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return;
  await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', key, JSON.stringify(value)]),
  });
}

// ─── Load contact with KV-backed cache ───────────────────────────────────────

async function loadContactCached(slug) {
  if (!slug) return null;

  const cacheKey = `contact-cache:${slug}`;
  const cached = await kvGet(cacheKey);

  if (cached && cached.fetchedAt) {
    const age = Date.now() - new Date(cached.fetchedAt).getTime();
    if (age < PROFILE_TTL_MS) {
      return { frontmatter: cached.frontmatter, body: cached.body, sha: cached.sha };
    }
  }

  const contact = await loadContact(slug);
  if (contact) {
    kvSet(cacheKey, { ...contact, fetchedAt: new Date().toISOString() });
  }
  return contact;
}

function invalidateCache(slug) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return;
  fetch(`${KV_REST_API_URL}/del/contact-cache:${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
}

// ─── Context update parsing ───────────────────────────────────────────────────

function parseContextUpdate(text) {
  const match = text.match(/\n\{"_ctx":\s*(\{[\s\S]*?\})\s*\}\s*$/);
  if (!match) return { clean: text, update: null };
  const clean = text.slice(0, text.length - match[0].length).trimEnd();
  try {
    return { clean, update: JSON.parse(match[1]) };
  } catch {
    return { clean: text, update: null };
  }
}

// ─── System prompt assembly ───────────────────────────────────────────────────

function buildSystemPrompt({ scores, selectedAnswer, contact }) {
  const fm = contact?.frontmatter ?? {};
  const effectiveScores = fm.scores ?? scores ?? Array(10).fill(0);
  const scoreBlock = AREA_KEYS.map((label, i) => `  ${label}: ${effectiveScores[i] ?? 0}/10`).join('\n');

  const parts = [
    FP_CONTEXT,
    `---\n## This Producer's Compass Scores\n${scoreBlock}`,
  ];

  if (selectedAnswer) {
    parts.push(`They identified this as their primary focus: "${selectedAnswer}"`);
  }

  if (contact?.body?.trim()) {
    parts.push(`---\n## Member Profile\n${contact.body.trim()}`);
  }

  const sessionLines = [];
  if ((fm.level ?? 1) > 1) sessionLines.push(`Level: ${fm.level}`);
  if (fm.homework && !fm.homework.completed) {
    sessionLines.push(`Current homework: ${fm.homework.text}`);
  }
  if (Array.isArray(fm.wins) && fm.wins.length) {
    const recent = fm.wins.slice(-5).map(w => `- ${w.text}`).join('\n');
    sessionLines.push(`Recent wins:\n${recent}`);
  }
  if (fm.context) sessionLines.push(`Coaching notes:\n${fm.context}`);
  if (sessionLines.length) {
    parts.push(`---\n## Live Coaching Context\n${sessionLines.join('\n\n')}`);
  }

  parts.push(`---
When you assign homework or log a win, append a JSON block at the very end of your response (after a blank line). The user will not see it — it is stripped server-side.

Format:
{"_ctx":{"wins":["brief win description"],"homework":"exact homework text","notes":"any coaching note to remember"}}

Only include keys with new information. Omit the block entirely if nothing to save.`);

  return parts.join('\n\n');
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'Server misconfiguration: missing API key' }, { status: 500, headers: CORS });
    }

    const { email, scores, selectedAnswer, messages } = await request.json();

    if (!messages?.length) {
      return Response.json({ error: 'Missing messages' }, { status: 400, headers: CORS });
    }

    // Look up slug from KV index, then load contact file from GitHub
    let contact = null;
    let slug = null;

    if (email) {
      const index = await kvGet(`email:${email.trim().toLowerCase()}`);
      slug = index?.slug ?? null;
      if (slug) contact = await loadContactCached(slug);
    }

    const systemPrompt = buildSystemPrompt({ scores, selectedAnswer, contact });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `Claude ${res.status}: ${err}` }, { status: 502, headers: CORS });
    }

    const data = await res.json();
    const rawText = data.content[0].text;
    const { clean: message, update } = parseContextUpdate(rawText);

    // Persist updates to contact file (fire-and-forget)
    const responsePayload = { message };

    if (update && contact && slug) {
      const prevFm = { ...contact.frontmatter };
      const updated = applyUpdate(contact, update);

      responsePayload.saved = true;
      if (update.wins?.length) {
        responsePayload.wins = update.wins;
        responsePayload.xp = updated.frontmatter.xp;
        responsePayload.level = updated.frontmatter.level;
        if (updated.frontmatter.level > prevFm.level) {
          responsePayload.levelUp = updated.frontmatter.level;
        }
      }
      if (update.homework) responsePayload.homework = update.homework;

      // Write contact file + append feed events (background)
      Promise.all([
        saveContact(updated).then(() => invalidateCache(slug)),
        ...buildFeedEvents(slug, contact.frontmatter.displayName, prevFm, updated.frontmatter, update)
          .map(event => ghAppendJsonl('contacts/_feed.jsonl', event).catch(console.error)),
      ]).catch(console.error);
    }

    return Response.json(responsePayload, { headers: CORS });

  } catch (err) {
    console.error('Agent route error:', err);
    return Response.json({ error: `Internal error: ${err.message}` }, { status: 500, headers: CORS });
  }
}
