/**
 * Next.js API Route — FP Agent
 * POST /api/agent
 *
 * Receives conversation state, injects Skill Tree context + member profile into
 * system prompt, calls Claude API, returns assistant response.
 *
 * Payload: { email, scores: number[10], selectedAnswer, messages: [{role, content}] }
 *
 * Member context flow:
 *   1. Look up user in KV by email
 *   2. If user has a contactSlug, fetch their contacts/*.md from GitHub (24h TTL)
 *   3. Inject profile + live coaching context into system prompt
 *   4. Claude may emit a {"_ctx":{...}} block at end of response to signal updates
 *   5. Route strips that block and writes updates (wins, homework, notes) back to KV
 *
 * Env vars required:
 *   ANTHROPIC_API_KEY
 *   KV_REST_API_URL / KV_REST_API_TOKEN   (Upstash)
 *   GITHUB_TOKEN                           (fine-grained PAT, read Contents on ZMT-Agent repo)
 *   GITHUB_CONTACTS_REPO                   (e.g. Lateralus4210/ZMT-Agent)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

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

// ─── KV helpers ───────────────────────────────────────────────────────────────

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

// ─── GitHub contacts fetch ────────────────────────────────────────────────────

const PROFILE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function fetchContactFromGitHub(slug) {
  const { GITHUB_TOKEN, GITHUB_CONTACTS_REPO } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_CONTACTS_REPO) return null;

  const url = `https://api.github.com/repos/${GITHUB_CONTACTS_REPO}/contents/contacts/${slug}.md`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.raw+json',
    },
  });

  if (!res.ok) {
    console.warn(`GitHub contacts fetch failed for ${slug}: ${res.status}`);
    return null;
  }

  return res.text();
}

async function getContactProfile(user) {
  if (!user?.contactSlug) return null;

  const profileStale =
    !user.profileFetchedAt ||
    Date.now() - new Date(user.profileFetchedAt).getTime() > PROFILE_TTL_MS;

  if (!profileStale && user.profile) return user.profile;

  const fresh = await fetchContactFromGitHub(user.contactSlug);
  if (fresh) {
    // Write back to KV in background — don't await (don't block response)
    const key = `user:${user.email}`;
    kvSet(key, { ...user, profile: fresh, profileFetchedAt: new Date().toISOString() });
    return fresh;
  }

  return user.profile || null;
}

// ─── Context update parsing ───────────────────────────────────────────────────
//
// The agent may append a JSON block to its response to signal state changes:
//   {"_ctx":{"wins":["..."],"homework":"...","notes":"..."}}
//
// All keys are optional. The block is stripped before the response reaches the user.

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

function applyContextUpdate(user, update) {
  if (!update) return user;

  const now = new Date().toISOString();
  let { context = '', wins = [], xp = 0, level = 1, homework = null } = user;

  if (update.wins?.length) {
    wins = [...(Array.isArray(wins) ? wins : []), ...update.wins.map(w => ({ text: w, loggedAt: now }))];
    xp = xp + update.wins.length * 10;
    level = Math.floor(xp / 50) + 1;
  }

  if (update.homework) {
    homework = { text: update.homework, assignedAt: now, completed: false };
  }

  if (update.notes) {
    context = context
      ? `${context}\n\n[${now}]\n${update.notes}`
      : `[${now}]\n${update.notes}`;
  }

  return { ...user, context, wins, xp, level, homework };
}

// ─── System prompt assembly ───────────────────────────────────────────────────

function buildSystemPrompt({ scores, selectedAnswer, profile, context, homework, wins, level }) {
  const scoreBlock = AREA_KEYS.map((label, i) => `  ${label}: ${scores[i] ?? 0}/10`).join('\n');

  const parts = [
    FP_CONTEXT,
    `---\n## This Producer's Compass Scores\n${scoreBlock}`,
  ];

  if (selectedAnswer) {
    parts.push(`They identified this as their primary focus: "${selectedAnswer}"`);
  }

  if (profile) {
    parts.push(`---\n## Member Profile (from FP contacts database)\n${profile}`);
  }

  if (context || homework || (wins?.length)) {
    const sessionLines = [];
    if (level > 1) sessionLines.push(`Level: ${level}`);
    if (homework && !homework.completed) sessionLines.push(`Current homework: ${homework.text}`);
    if (wins?.length) {
      const recent = wins.slice(-5).map(w => `- ${w.text}`).join('\n');
      sessionLines.push(`Recent wins:\n${recent}`);
    }
    if (context) sessionLines.push(`Coaching notes:\n${context}`);
    if (sessionLines.length) {
      parts.push(`---\n## Live Coaching Context\n${sessionLines.join('\n\n')}`);
    }
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
      console.error('ANTHROPIC_API_KEY is not set');
      return Response.json({ error: 'Server misconfiguration: missing API key' }, { status: 500, headers: CORS });
    }

    const { email, scores, selectedAnswer, messages } = await request.json();

    if (!messages || !messages.length) {
      return Response.json({ error: 'Missing messages' }, { status: 400, headers: CORS });
    }

    // Load member context from KV + GitHub
    let user = null;
    if (email) {
      user = await kvGet(`user:${email.trim().toLowerCase()}`);
    }

    const profile = user ? await getContactProfile(user) : null;

    const systemPrompt = buildSystemPrompt({
      scores: scores || Array(10).fill(0),
      selectedAnswer,
      profile,
      context: user?.context || '',
      homework: user?.homework || null,
      wins: user?.wins || [],
      level: user?.level || 1,
    });

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
      console.error('Claude API error:', res.status, err);
      return Response.json({ error: `Claude ${res.status}: ${err}` }, { status: 502, headers: CORS });
    }

    const data = await res.json();
    const rawText = data.content[0].text;

    // Parse and save any context updates the agent emitted
    const { clean: message, update } = parseContextUpdate(rawText);

    if (update && user) {
      const updated = applyContextUpdate(user, update);
      kvSet(`user:${user.email}`, updated); // fire-and-forget
    }

    // Return visible message + any XP/level changes the UI might want
    const responsePayload = { message };
    if (update && user) {
      const updated = applyContextUpdate(user, update);
      if (updated.xp !== user.xp) responsePayload.xp = updated.xp;
      if (updated.level !== user.level) responsePayload.level = updated.level;
      if (update.wins?.length) responsePayload.wins = update.wins;
      if (update.homework) responsePayload.homework = update.homework;
    }

    return Response.json(responsePayload, { headers: CORS });

  } catch (err) {
    console.error('Agent route unhandled error:', err);
    return Response.json({ error: `Internal error: ${err.message}` }, { status: 500, headers: CORS });
  }
}
