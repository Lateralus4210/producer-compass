/**
 * GitHub Contents API helpers.
 *
 * All reads/writes target the repo in GITHUB_CONTACTS_REPO using GITHUB_TOKEN.
 * Writes require the file's current SHA (GitHub's optimistic-lock mechanism).
 * On a 409 conflict (concurrent write), we re-fetch and retry once.
 *
 * Env vars:
 *   GITHUB_TOKEN          — fine-grained PAT, read+write Contents on the repo
 *   GITHUB_CONTACTS_REPO  — e.g. "Lateralus4210/the-free-producer"
 */

function apiBase() {
  const repo = process.env.GITHUB_CONTACTS_REPO;
  if (!repo) throw new Error('GITHUB_CONTACTS_REPO not set');
  return `https://api.github.com/repos/${repo}/contents`;
}

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/**
 * Fetch a file. Returns { content: string, sha: string } or null if not found.
 */
export async function ghGet(path) {
  const res = await fetch(`${apiBase()}/${path}`, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} → ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

/**
 * Write a file. Creates if sha is null, updates otherwise.
 * Returns the new sha.
 * On 409 conflict, fetches current sha and retries once.
 */
export async function ghPut(path, content, sha, message = 'agent update') {
  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(`${apiBase()}/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    // Concurrent write — re-fetch sha and retry once
    const current = await ghGet(path);
    if (!current) throw new Error(`GitHub 409 on ${path} but file not found on retry`);
    const retry = await fetch(`${apiBase()}/${path}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, sha: current.sha }),
    });
    if (!retry.ok) throw new Error(`GitHub PUT ${path} retry → ${retry.status}`);
    const retryData = await retry.json();
    return retryData.content.sha;
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT ${path} → ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content.sha;
}

/**
 * Append a line to a JSONL file. Creates the file if it doesn't exist.
 * Suitable for low-frequency event feeds (_feed.jsonl).
 */
export async function ghAppendJsonl(path, record) {
  const existing = await ghGet(path);
  const line = JSON.stringify(record) + '\n';
  const newContent = existing ? existing.content + line : line;
  await ghPut(path, newContent, existing?.sha ?? null, 'feed append');
}
