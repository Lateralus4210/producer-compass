/**
 * Next.js API Route — Session
 *
 * GET  /api/session — read fp_email cookie, return user data if found
 * POST /api/session — login by email (no password), set cookie, return user data
 *
 * User record shape stored in KV:
 *   { email, displayName, scores: number[10], savedAt }
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const COOKIE_NAME = 'fp_email';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

const ADMIN_EMAILS = ['zach.a.burger@gmail.com', 'skynewso94@gmail.com'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveRole(email, existingRole) {
  if (ADMIN_EMAILS.includes(email)) return 'admin';
  return existingRole || 'lead';
}

// ─── Upstash REST helpers ─────────────────────────────────────────────────────

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

// ─── Handlers ─────────────────────────────────────────────────────────────────

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request) {
  const email = readCookie(request, COOKIE_NAME);
  if (!email) return Response.json({ user: null }, { headers: CORS });

  const key = email.toLowerCase();
  let user = await kvGet(`user:${key}`);

  // Auto-seed admin accounts that haven't logged in via survey
  if (!user && ADMIN_EMAILS.includes(key)) {
    user = { email: key, displayName: '', scores: Array(10).fill(0), role: 'admin', savedAt: new Date().toISOString() };
    await kvSet(`user:${key}`, user);
  }

  if (!user) return Response.json({ user: null }, { headers: CORS });

  const role = resolveRole(key, user.role);
  if (user.role !== role) await kvSet(`user:${key}`, { ...user, role });

  return Response.json({ user: { ...user, role } }, { headers: CORS });
}

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400, headers: CORS });
  }

  const key = email.trim().toLowerCase();
  let user = await kvGet(`user:${key}`);

  // Auto-seed admin accounts on first login
  if (!user && ADMIN_EMAILS.includes(key)) {
    user = { email: key, displayName: '', scores: Array(10).fill(0), role: 'admin', savedAt: new Date().toISOString() };
    await kvSet(`user:${key}`, user);
  }

  if (!user) {
    return Response.json(
      { error: 'No account found for that email.' },
      { status: 404, headers: CORS }
    );
  }

  const role = resolveRole(key, user.role);
  if (user.role !== role) await kvSet(`user:${key}`, { ...user, role });

  return Response.json({ user: { ...user, role } }, {
    headers: { ...CORS, 'Set-Cookie': setCookieHeader(key) },
  });
}
