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
import { createContact, loadContact, saveContact } from '../../../lib/contact.js';
import { ghAppendJsonl } from '../../../lib/github.js';

const COOKIE_NAME = 'fp_email';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

// ─── Upstash REST helper (index only) ────────────────────────────────────────

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

const AREA_KEYS = [
  'composition', 'theory', 'daw', 'mixing', 'mastering',
  'collab', 'artwork', 'release', 'ideation', 'promo',
];

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

  // Create or update contact file + register in KV index
  const emailKey = email.trim().toLowerCase();
  try {
    const existingIndex = await kvGet(`email:${emailKey}`);
    if (existingIndex?.slug) {
      // Update existing contact's scores + answers
      const contact = await loadContact(existingIndex.slug);
      if (contact) {
        contact.frontmatter.scores = scores;
        contact.frontmatter.answers = answers ?? null;
        contact.frontmatter.displayName = displayName || name || contact.frontmatter.displayName;
        await saveContact(contact, 'skill tree resubmission');
      }
    } else {
      // New contact
      const contact = await createContact({
        email: emailKey,
        name: name || displayName || '',
        displayName: displayName || name || '',
        role: 'lead',
        scores,
        answers: answers ?? null,
      });
      await kvSet(`email:${emailKey}`, { slug: contact.slug, role: 'lead' });

      // Feed event: new lead created
      ghAppendJsonl('contacts/_feed.jsonl', {
        ts: new Date().toISOString(),
        contact: contact.slug,
        name: displayName || name || emailKey,
        event: 'new_lead',
        strongest: fields.strongest,
        weakest: fields.weakest,
        scores,
      }).catch(console.error);
    }
  } catch (err) {
    // Non-fatal — MailerLite + Sheets already captured the submission
    console.error('Contact file create/update failed:', err);
  }

  return Response.json({ ok: true }, {
    headers: {
      ...CORS,
      'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(emailKey)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`,
    },
  });
}
