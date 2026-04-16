/**
 * Next.js API Route — Session
 *
 * GET  /api/session — read fp_email cookie, return user data from contact file
 * POST /api/session — login by email (no password), set cookie, return user data
 *
 * KV is a thin email→slug index only:
 *   key: "email:{email}"  →  value: { slug, role }
 *
 * All user data (scores, wins, homework, level, xp, context) lives in the
 * contact file at contacts/{slug}.md in the GitHub repo.
 *
 * On first login (email not in index):
 *   - Admins: look up existing contact file by known slug, register in index
 *   - Others: contact file should already exist from Skill Tree submission
 *     If not (direct login without Skill Tree), a stub is created automatically
 */

import { loadContact, createContact } from '../../../lib/contact.js';
import { ghGetJson } from '../../../lib/github.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const COOKIE_NAME = 'fp_email';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

const ADMIN_EMAILS = ['zach.a.burger@gmail.com', 'skynewso94@gmail.com'];
const ADMIN_SLUGS = {
  'zach.a.burger@gmail.com': 'zach-burger',
  'skynewso94@gmail.com': 'skyler-newsome',
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

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function readCookie(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookieHeader(email) {
  return `${COOKIE_NAME}=${encodeURIComponent(email)}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// ─── Resolve contact for an email ────────────────────────────────────────────

async function resolveContact(email) {
  const key = email.trim().toLowerCase();

  // Check KV index
  let index = await kvGet(`email:${key}`);

  if (!index) {
    // Admin: hardcoded slug
    if (ADMIN_EMAILS.includes(key)) {
      const slug = ADMIN_SLUGS[key];
      const contact = await loadContact(slug);
      if (!contact) return null;
      index = { slug, role: 'admin' };
      await kvSet(`email:${key}`, index);
    } else {
      // Check _index.json (seeded from Skool member CSV) before auto-creating
      const emailIndex = await ghGetJson('contacts/_index.json');
      const entry = emailIndex?.[key];

      if (entry?.slug) {
        // Known member from Skool — check if their contact file exists, create stub if not
        let contact = await loadContact(entry.slug);
        if (!contact) {
          contact = await createContact({
            email: key,
            name: entry.name,
            role: entry.role ?? 'lead',
          });
        }
        index = { slug: entry.slug, role: entry.role ?? 'lead' };
        await kvSet(`email:${key}`, index);
      } else {
        // Completely unknown — auto-create stub
        const contact = await createContact({ email: key, role: 'lead' });
        index = { slug: contact.slug, role: 'lead' };
        await kvSet(`email:${key}`, index);
      }
    }
  }

  const contact = await loadContact(index.slug);
  if (!contact) return null;

  return {
    email: key,
    slug: index.slug,
    role: index.role ?? contact.frontmatter.role ?? 'lead',
    displayName: contact.frontmatter.displayName || contact.frontmatter.name || '',
    scores: contact.frontmatter.scores ?? null,
    level: contact.frontmatter.level ?? 1,
    xp: contact.frontmatter.xp ?? 0,
    homework: contact.frontmatter.homework ?? null,
    wins: contact.frontmatter.wins ?? [],
  };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request) {
  const email = readCookie(request, COOKIE_NAME);
  if (!email) return Response.json({ user: null }, { headers: CORS });

  try {
    const user = await resolveContact(email);
    return Response.json({ user }, { headers: CORS });
  } catch (err) {
    console.error('Session GET error:', err);
    return Response.json({ user: null }, { headers: CORS });
  }
}

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400, headers: CORS });
  }

  const key = email.trim().toLowerCase();

  try {
    const user = await resolveContact(key);
    if (!user) {
      return Response.json({ error: 'Could not resolve contact.' }, { status: 404, headers: CORS });
    }

    return Response.json({ user }, {
      headers: { ...CORS, 'Set-Cookie': setCookieHeader(key) },
    });
  } catch (err) {
    console.error('Session POST error:', err);
    return Response.json({ error: 'Internal error' }, { status: 500, headers: CORS });
  }
}
