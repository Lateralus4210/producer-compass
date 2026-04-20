/**
 * Next.js API Route — Skill Tree email capture
 * POST /api/skill-tree-subscribe
 *
 * Receives a POST from the Skill Tree results screen,
 * adds the subscriber to MailerLite with score custom fields,
 * and logs the full submission to Google Sheets.
 *
 * Environment variables (Vercel dashboard → Settings → Environment Variables):
 *   ML_API_KEY                  — MailerLite API key
 *   ML_GROUP_ID                 — MailerLite Group ID for the Skill Tree list
 *   GOOGLE_SERVICE_ACCOUNT_JSON — Full service account JSON key (stringified)
 *   GOOGLE_SHEET_ID             — Sheet ID from the Sheets URL
 *
 * Payload: { name, displayName, email, scores: number[10], answers: number[70] }
 * Scores index order: composition, theory, daw, mixing, mastering,
 *                     collab, artwork, release, ideation, promo
 */

import { createSign } from 'crypto';

const COOKIE_NAME = 'fp_email';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

const REPO = 'Lateralus4210/the-free-producer';

const AREA_LABELS = [
  'Composition', 'Music Theory', 'DAW Proficiency', 'Mixing', 'Mastering',
  'Collaboration', 'Artwork/Content', 'Release Process', 'Ideation', 'Promo',
];

function emailToSlug(email) {
  return email.trim().toLowerCase().replace(/\./g, '');
}

// Creates leads/{slug}.md stub. Skips if already in contacts/ (existing member)
// or already in leads/ (returning lead).
async function createLeadStub(slug, name, email, scores) {
  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) return;

  const now = new Date().toISOString();
  const scoreLines = AREA_LABELS.map((label, i) => `  ${label}: ${scores[i] ?? 0}`).join('\n');
  const content = [
    '---',
    `name: ${name || email}`,
    `email: ${email}`,
    `submitted: ${now}`,
    `call_interest: false`,
    `message_count: 0`,
    `role: lead`,
    `scores:`,
    scoreLines,
    '---',
    '',
    `# ${name || email}`,
    '',
    `_Submitted via Skill Tree on ${now}_`,
    '',
  ].join('\n');

  const headers = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' };

  // Skip if already in contacts/ (existing member)
  const contactsCheck = await fetch(
    `https://api.github.com/repos/${REPO}/contents/contacts/${slug}.md`,
    { headers }
  );
  if (contactsCheck.ok) return;

  // Skip if already in leads/ on today's date (returning lead same day)
  const dateDir = new Date().toISOString().split('T')[0];
  const leadsCheck = await fetch(
    `https://api.github.com/repos/${REPO}/contents/leads/${dateDir}/${slug}.md`,
    { headers }
  );
  if (leadsCheck.ok) return;

  const dateDir = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  await fetch(`https://api.github.com/repos/${REPO}/contents/leads/${dateDir}/${slug}.md`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `lead: ${slug}`,
      content: Buffer.from(content).toString('base64'),
    }),
  });
}

// ─── Upstash REST helper ──────────────────────────────────────────────────────

async function kvSet(key, value) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return;
  await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', key, JSON.stringify(value)]),
  });
}

const AREA_KEYS = [
  'composition', 'theory', 'daw', 'mixing', 'mastering',
  'collab', 'artwork', 'release', 'ideation', 'promo',
]; // MailerLite field names (short form)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Google Sheets helpers ────────────────────────────────────────────────────

async function getGoogleAccessToken() {
  const sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, 'base64url');
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function appendSheetRow(values) {
  const token = await getGoogleAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [values] }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('Sheets append error:', res.status, err);
  }
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  const { name, displayName, email, scores, answers } = await request.json();

  if (!email || !scores || scores.length !== 10) {
    return Response.json({ error: 'Missing required fields' }, { status: 400, headers: CORS });
  }

  // Build custom field map
  const fields = { name: name || displayName };
  AREA_KEYS.forEach((key, i) => { fields[key] = scores[i] ?? 0; });

  // Derive strongest / weakest
  const ranked     = AREA_KEYS.map((key, i) => ({ key, score: scores[i] ?? 0 }));
  fields.strongest = [...ranked].sort((a, b) => b.score - a.score)[0].key;
  fields.weakest   = [...ranked].sort((a, b) => a.score - b.score)[0].key;

  // MailerLite subscription
  const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ML_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      fields,
      groups: [process.env.ML_GROUP_ID],
    }),
  });

  if (mlRes.status !== 200 && mlRes.status !== 201) {
    const errText = await mlRes.text();
    console.error('MailerLite error:', mlRes.status, errText);
    return Response.json(
      { error: 'Subscription failed — please try again.' },
      { status: 502, headers: CORS }
    );
  }

  // Google Sheets logging (awaited — serverless fn must not exit before this completes)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_SHEET_ID) {
    const row = [
      new Date().toISOString(),
      email.trim(),
      name || displayName || '',
      displayName || '',
      fields.strongest,
      fields.weakest,
      ...scores,
      ...(answers && answers.length === 70 ? answers : Array(70).fill('')),
    ];
    try {
      await appendSheetRow(row);
    } catch (err) {
      console.error('Sheets log failed:', err);
    }
  }

  // Write to KV and set session cookie
  const emailKey = email.trim().toLowerCase();
  await kvSet(`user:${emailKey}`, {
    email: emailKey,
    displayName: displayName || name || '',
    scores,
    role: 'lead',
    messageCount: 0,
    savedAt: new Date().toISOString(),
  });

  // Create lead stub in GitHub (skips if already a member or returning lead)
  await createLeadStub(emailToSlug(emailKey), displayName || name || '', emailKey, scores);

  return Response.json({ ok: true }, {
    headers: {
      ...CORS,
      'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(emailKey)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`,
    },
  });
}
