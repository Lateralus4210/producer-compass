/**
 * Next.js API Route — Skill Tree email capture
 * POST /api/skill-tree-subscribe
 *
 * Receives a POST from the Skill Tree results screen,
 * adds the subscriber to MailerLite with score custom fields.
 *
 * Environment variables (Vercel dashboard → Settings → Environment Variables):
 *   ML_API_KEY   — MailerLite API key (Settings → Integrations → API)
 *   ML_GROUP_ID  — MailerLite Group ID for the Skill Tree subscriber list
 *
 * Payload: { name, displayName, email, scores: number[10] }
 * Scores index order: composition, theory, daw, mixing, mastering,
 *                     collab, artwork, release, ideation, promo
 */

const AREA_KEYS = [
  'composition', 'theory', 'daw', 'mixing', 'mastering',
  'collab', 'artwork', 'release', 'ideation', 'promo',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  const { name, displayName, email, scores } = await request.json();

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

  return Response.json({ ok: true }, { headers: CORS });
}
