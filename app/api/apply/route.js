/**
 * POST /api/apply
 *
 * Receives triage form data from the /work-with-us application flow.
 * Logs to the "Applications" tab in the Google Sheet.
 *
 * Columns: Timestamp | Email | Name | Tracks Started | Tracks Released | Years Producing
 *
 * Note: Create an "Applications" tab in the Google Sheet before using this route.
 *
 * Payload: { name, email, projectsStarted, projectsReleased, yearsProducing }
 */

import { createSign } from "crypto";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function getGoogleAccessToken() {
  const sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, "base64url");
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function appendRow(values) {
  const token = await getGoogleAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Applications!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error("Sheets append error:", res.status, err);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  const { name, email, projectsStarted, projectsReleased, yearsProducing } = await request.json();

  if (!email) {
    return Response.json({ error: "Missing email" }, { status: 400, headers: CORS });
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_SHEET_ID) {
    const row = [
      new Date().toISOString(),
      email.trim().toLowerCase(),
      name || "",
      projectsStarted || "",
      projectsReleased || "",
      yearsProducing || "",
    ];
    try {
      await appendRow(row);
    } catch (err) {
      console.error("Sheets log failed:", err);
    }
  }

  return Response.json({ ok: true }, { headers: CORS });
}
