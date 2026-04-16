/**
 * Next.js API Route — FP Agent
 * POST /api/agent
 *
 * Receives conversation state, injects Skill Tree context into system prompt,
 * calls Claude API, returns assistant response.
 *
 * Payload: { email, scores: number[10], selectedAnswer, messages: [{role, content}] }
 */

import { readFileSync } from 'fs';
import { join } from 'path';

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

const SYSTEM_PROMPT = FP_CONTEXT || `You are a music production coach at The Free Producer — a community for producers who are done leaving music on their hard drives.

Your job is to understand where this producer is actually stuck, then help them see a clear path forward. You are not here to teach theory or give tutorials. You are here to diagnose the real obstacle and guide them toward taking action.

Your style: sharp, direct, genuinely curious. You ask one question at a time. You don't recap what they said. You don't over-explain. You listen for what they're not saying as much as what they are.

In the first few exchanges, your goal is to get specific. Vague answers get a follow-up that makes them concrete. Once you understand the real obstacle, you can begin pointing toward what would actually move them.

Keep responses short — 2–4 sentences max unless a longer answer is clearly warranted.`;

function buildScoreContext(scores) {
  return AREA_KEYS.map((label, i) => `  ${label}: ${scores[i] ?? 0}/10`).join('\n');
}

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

    const systemWithContext = `${SYSTEM_PROMPT}

---
This producer's Compass Skill Tree scores (out of 10):
${buildScoreContext(scores)}

They have chosen this as their primary focus: "${selectedAnswer}"
---`;

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
        system: systemWithContext,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Claude API error:', res.status, err);
      return Response.json({ error: `Claude ${res.status}: ${err}` }, { status: 502, headers: CORS });
    }

    const data = await res.json();
    return Response.json({ message: data.content[0].text }, { headers: CORS });
  } catch (err) {
    console.error('Agent route unhandled error:', err);
    return Response.json({ error: `Internal error: ${err.message}` }, { status: 500, headers: CORS });
  }
}
