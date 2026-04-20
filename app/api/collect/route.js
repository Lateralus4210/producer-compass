/**
 * Next.js API Route — Admin Collect
 * GET /api/collect?days=7
 *
 * Returns a three-tier lead summary for admin review.
 * All data sourced from KV — no file parsing needed.
 *
 * Tiers:
 *   qualified   — call_interest: true, role: lead (detailed list)
 *   unqualified — call_interest: false, role: lead (count only)
 *   contacts    — role: member (count only, not surfaced by default)
 *
 * Query params:
 *   days  — lookback window for unqualified count (default: 7)
 *   all   — if "true", include full unqualified list (not just count)
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

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7', 10);
  const showAll = searchParams.get('all') === 'true';

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const keys = await kvKeys('user:*');
  const users = await Promise.all(keys.map(k => kvGet(k)));
  const all = users.filter(u => u?.email);

  const qualified = all
    .filter(u => u.role !== 'admin' && u.call_interest)
    .sort((a, b) => new Date(b.call_interest_at || 0) - new Date(a.call_interest_at || 0))
    .map(u => ({
      email: u.email,
      displayName: u.displayName || '',
      messageCount: u.messageCount || 0,
      call_interest_at: u.call_interest_at || null,
      savedAt: u.savedAt || null,
    }));

  const unqualifiedAll = all.filter(u => u.role !== 'admin' && !u.call_interest && u.role !== 'member');
  const unqualifiedRecent = unqualifiedAll.filter(u => (u.savedAt || '') >= cutoff);

  const contactsCount = all.filter(u => u.role === 'member').length;

  return Response.json({
    qualified,
    unqualified: showAll
      ? unqualifiedAll.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
      : null,
    unqualifiedCount: unqualifiedAll.length,
    unqualifiedRecentCount: unqualifiedRecent.length,
    contactsCount,
    days,
    asOf: new Date().toISOString(),
  }, { headers: CORS });
}
