/**
 * Next.js API Route — Admin Collect
 * GET /api/collect
 *
 * Returns a summary of all leads for admin review:
 * - Leads with call_interest: true (sorted by interest date)
 * - All other leads (sorted by most recent activity)
 *
 * Admin-only. Verified via fp_email cookie + role check in KV.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function readCookie(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
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

async function kvKeys(pattern) {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return [];
  const res = await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['KEYS', pattern]),
  });
  const { result } = await res.json();
  return Array.isArray(result) ? result : [];
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request) {
  const email = readCookie(request, 'fp_email');
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS });

  const admin = await kvGet(`user:${email}`);
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: CORS });
  }

  const keys = await kvKeys('user:*');
  const users = await Promise.all(keys.map(k => kvGet(k)));
  const leads = users.filter(u => u && u.role !== 'admin' && u.email);

  const interested = leads
    .filter(u => u.call_interest)
    .sort((a, b) => new Date(b.call_interest_at || 0) - new Date(a.call_interest_at || 0));

  const others = leads
    .filter(u => !u.call_interest)
    .sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));

  return Response.json({
    interested,
    others,
    total: leads.length,
    asOf: new Date().toISOString(),
  }, { headers: CORS });
}
