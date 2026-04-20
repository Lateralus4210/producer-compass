/**
 * Next.js API Route — FP Agent
 * POST /api/agent
 *
 * Loads contact profile from contacts/{slug}.md or leads/{slug}.md,
 * injects into system prompt, calls Claude, appends exchange to file.
 * Slug = email with dots stripped (rsonic9@gmail.com → rsonic9@gmailcom).
 *
 * Payload: { email, scores: number[10], selectedAnswer, messages: [{role, content}] }
 *
 * Env vars required:
 *   ANTHROPIC_API_KEY
 *   KV_REST_API_URL / KV_REST_API_TOKEN   (Upstash)
 *   GITHUB_TOKEN                           (fine-grained PAT, read+write Contents on this repo)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const REPO = 'Lateralus4210/the-free-producer';

// ─── Static context ───────────────────────────────────────────────────────────

function loadFile(name) {
  try {
    return readFileSync(join(process.cwd(), 'lib', name), 'utf8');
  } catch {
    return '';
  }
}

const FP_CONTEXT = loadFile('fp-context.md');
const FP_SCRIPT  = loadFile('fp-script.md');

const AREA_KEYS = [
  'Composition', 'Music Theory', 'DAW Proficiency', 'Mixing', 'Mastering',
  'Collaboration', 'Artwork/Content', 'Release Process', 'Ideation', 'Promo',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const LEAD_SOFT_LIMIT = 4;
const LEAD_HARD_LIMIT = 15;

// ─── Slug helper ──────────────────────────────────────────────────────────────

function emailToSlug(email) {
  return email.trim().toLowerCase().replace(/\./g, '');
}

// ─── GitHub helpers ───────────────────────────────────────────────────────────

// Returns { content, sha, path } or null.
// Checks contacts/{slug}.md first, then leads/{YYYY-MM-DD}/{slug}.md using savedAt.
async function fetchContactFile(slug, savedAt) {
  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) return null;

  const ghGet = async (path) => {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      content: Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8'),
      sha: data.sha,
      path,
    };
  };

  // Try flat contacts/ first (curated member profiles)
  const contact = await ghGet(`contacts/${slug}.md`);
  if (contact) return contact;

  // Try leads/ with date subdir derived from KV savedAt
  if (savedAt) {
    const dateDir = new Date(savedAt).toISOString().split('T')[0];
    const lead = await ghGet(`leads/${dateDir}/${slug}.md`);
    if (lead) return lead;
  }

  return null;
}

async function writeContactFile(path, content, sha) {
  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) return;

  const body = {
    message: `agent: update ${path}`,
    content: Buffer.from(content).toString('base64'),
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    console.warn(`GitHub write failed for ${path}:`, res.status, await res.text());
  }
}

// Returns only the profile section (everything before ## Conversation Log)
function profileSection(content) {
  const logIdx = content.indexOf('## Conversation Log');
  return logIdx === -1 ? content : content.slice(0, logIdx).trimEnd();
}

function appendExchange(content, userMsg, assistantMsg) {
  const ts = new Date().toISOString();
  const block = `\n\n**[${ts}]**\n\n> ${userMsg.replace(/\n/g, '\n> ')}\n\n${assistantMsg}`;
  if (content.includes('## Conversation Log')) {
    return content.trimEnd() + block;
  }
  return content.trimEnd() + '\n\n## Conversation Log' + block;
}

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
    context = context ? `${context}\n\n[${now}]\n${update.notes}` : `[${now}]\n${update.notes}`;
  }
  return { ...user, context, wins, xp, level, homework };
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt({ scores, selectedAnswer, profile, context, homework, wins, level, messageCount, role }) {
  const scoreBlock = AREA_KEYS.map((label, i) => `  ${label}: ${scores[i] ?? 0}/10`).join('\n');

  const parts = [
    FP_CONTEXT,
    FP_SCRIPT,
    `---\n## This Producer's Compass Scores\n${scoreBlock}`,
  ];

  if (selectedAnswer) {
    parts.push(`They identified this as their primary focus: "${selectedAnswer}"`);
  }

  if (profile) {
    parts.push(`---\n## Member Profile\n${profile}`);
  }

  if (context || homework || wins?.length) {
    const lines = [];
    if (level > 1) lines.push(`Level: ${level}`);
    if (homework && !homework.completed) lines.push(`Current homework: ${homework.text}`);
    if (wins?.length) lines.push(`Recent wins:\n${wins.slice(-5).map(w => `- ${w.text}`).join('\n')}`);
    if (context) lines.push(`Coaching notes:\n${context}`);
    if (lines.length) parts.push(`---\n## Live Coaching Context\n${lines.join('\n\n')}`);
  }

  // Guide leads toward Compass coaching. The Skill Tree and this agent are the lead magnet —
  // the real offer is Compass coaching (accountability calls + unlimited agent access).
  // Free Skool community membership is also included with Compass. Start surfacing this early.
  if (role !== 'admin' && role !== 'member') {
    const remaining = LEAD_HARD_LIMIT - (messageCount || 0);
    if (remaining <= LEAD_HARD_LIMIT - LEAD_SOFT_LIMIT) {
      parts.push(`---\nThis producer has ${remaining} free message${remaining === 1 ? '' : 's'} remaining on the free tier. The Skill Tree and this agent are a preview — the actual offer is Compass coaching: accountability calls with Zach + Skyler, unlimited agent access, and free access to The Free Producer Skool community. Naturally work this into the conversation. When they express interest in a call or in going deeper, end your response with the exact token: CALL_INTEREST_CONFIRMED`);
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
      return Response.json({ error: 'Server misconfiguration: missing API key' }, { status: 500, headers: CORS });
    }

    const { email, scores, selectedAnswer, messages } = await request.json();

    if (!messages?.length) {
      return Response.json({ error: 'Missing messages' }, { status: 400, headers: CORS });
    }

    const emailKey = email ? email.trim().toLowerCase() : null;
    const slug = emailKey ? emailToSlug(emailKey) : null;

    // Load KV user and GitHub contact file in parallel
    const user = emailKey ? await kvGet(`user:${emailKey}`) : null;
    const contactFile = slug ? await fetchContactFile(slug, user?.savedAt) : null;

    // Hard limit for leads
    if (user && user.role !== 'admin' && user.role !== 'member') {
      if ((user.messageCount || 0) >= LEAD_HARD_LIMIT) {
        return Response.json({
          message: "You've reached the free conversation limit. To keep going, the next step is a Compass call — that's where the real work happens. If you're open to it, let us know and we'll be in touch.",
          limitReached: true,
        }, { headers: CORS });
      }
    }

    const profile = contactFile ? profileSection(contactFile.content) : null;

    const systemPrompt = buildSystemPrompt({
      scores: scores || Array(10).fill(0),
      selectedAnswer,
      profile,
      context: user?.context || '',
      homework: user?.homework || null,
      wins: user?.wins || [],
      level: user?.level || 1,
      messageCount: user?.messageCount || 0,
      role: user?.role || 'lead',
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
    const { clean: message, update } = parseContextUpdate(rawText);

    // Detect call interest signal from agent
    const callInterest = message.includes('CALL_INTEREST_CONFIRMED');
    const cleanMessage = message.replace('CALL_INTEREST_CONFIRMED', '').trimEnd();

    // Update KV
    const newCount = (user?.messageCount || 0) + 1;
    const atSoftLimit = newCount >= LEAD_SOFT_LIMIT && newCount < LEAD_HARD_LIMIT;
    let updatedUser = { ...(user || { email: emailKey }), messageCount: newCount };
    if (update) updatedUser = applyContextUpdate(updatedUser, update);
    if (callInterest) updatedUser = { ...updatedUser, call_interest: true, call_interest_at: new Date().toISOString() };
    if (emailKey) kvSet(`user:${emailKey}`, updatedUser); // fire-and-forget

    // Append exchange to GitHub contact file
    if (contactFile && messages.length > 0) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const updatedContent = appendExchange(contactFile.content, lastUserMsg, cleanMessage);
      await writeContactFile(contactFile.path, updatedContent, contactFile.sha);
    }

    // Build response payload
    const payload = { message: cleanMessage };
    if (update && user) {
      const updated = applyContextUpdate(user, update);
      if (updated.xp !== (user.xp || 0)) payload.xp = updated.xp;
      if (updated.level !== (user.level || 1)) payload.level = updated.level;
      if (update.wins?.length) payload.wins = update.wins;
      if (update.homework) payload.homework = update.homework;
    }
    if (callInterest) payload.callInterest = true;
    if (atSoftLimit && user?.role !== 'admin' && user?.role !== 'member') payload.softLimit = true;

    return Response.json(payload, { headers: CORS });

  } catch (err) {
    console.error('Agent route unhandled error:', err);
    return Response.json({ error: `Internal error: ${err.message}` }, { status: 500, headers: CORS });
  }
}
