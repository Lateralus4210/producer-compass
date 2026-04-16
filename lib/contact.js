/**
 * Contact file helpers.
 *
 * Contact files live at contacts/{slug}.md in the web repo.
 * Format: YAML frontmatter block followed by free-form markdown body.
 *
 * Frontmatter is the single source of truth for structured data.
 * The markdown body is human/agent-maintained narrative.
 *
 * Frontmatter shape:
 *   email        string
 *   slug         string
 *   name         string
 *   displayName  string
 *   role         "lead" | "member" | "admin"
 *   scores       number[10] | null
 *   answers      number[70] | null
 *   level        number
 *   xp           number
 *   homework     { text, assignedAt, completed } | null
 *   wins         [{ text, loggedAt }]
 *   context      string   — accumulated coaching notes
 *   savedAt      ISO string
 */

import { ghGet, ghPut } from './github.js';

const CONTACTS_DIR = 'contacts';

// ─── Slug generation ──────────────────────────────────────────────────────────

export function slugFromName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugFromEmail(email) {
  return email.split('@')[0].replace(/[^a-z0-9]+/g, '-');
}

// ─── Frontmatter parse / serialize ───────────────────────────────────────────

// Minimal YAML serializer — handles the subset we use (strings, numbers, booleans,
// arrays of primitives, arrays of objects with string/number/boolean values, null).
function serializeYaml(obj, indent = '') {
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      lines.push(`${indent}${k}: null`);
    } else if (typeof v === 'boolean') {
      lines.push(`${indent}${k}: ${v}`);
    } else if (typeof v === 'number') {
      lines.push(`${indent}${k}: ${v}`);
    } else if (typeof v === 'string') {
      const escaped = v.includes('\n') ? `"${v.replace(/"/g, '\\"')}"` : `"${v.replace(/"/g, '\\"')}"`;
      lines.push(`${indent}${k}: ${escaped}`);
    } else if (Array.isArray(v)) {
      if (v.length === 0) {
        lines.push(`${indent}${k}: []`);
      } else if (typeof v[0] === 'object' && v[0] !== null) {
        lines.push(`${indent}${k}:`);
        for (const item of v) {
          const entries = Object.entries(item);
          const first = entries[0];
          const rest = entries.slice(1);
          const fv = typeof first[1] === 'string' ? `"${first[1].replace(/"/g, '\\"')}"` : first[1];
          lines.push(`${indent}  - ${first[0]}: ${fv}`);
          for (const [ik, iv] of rest) {
            const ivs = typeof iv === 'string' ? `"${iv.replace(/"/g, '\\"')}"` : iv;
            lines.push(`${indent}    ${ik}: ${ivs}`);
          }
        }
      } else {
        lines.push(`${indent}${k}: [${v.join(', ')}]`);
      }
    } else if (typeof v === 'object') {
      lines.push(`${indent}${k}:`);
      lines.push(serializeYaml(v, indent + '  '));
    }
  }
  return lines.join('\n');
}

// Minimal YAML parser — handles the subset we write above.
function parseYaml(text) {
  const obj = {};
  const lines = text.split('\n');
  let i = 0;

  function parseValue(raw) {
    raw = raw.trim();
    if (raw === 'null') return null;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
    if (raw.startsWith('[') && raw.endsWith(']')) {
      const inner = raw.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(',').map(s => parseValue(s.trim()));
    }
    if ((raw.startsWith('"') && raw.endsWith('"')) ||
        (raw.startsWith("'") && raw.endsWith("'"))) {
      return raw.slice(1, -1).replace(/\\"/g, '"');
    }
    return raw;
  }

  while (i < lines.length) {
    const line = lines[i];
    const keyMatch = line.match(/^(\w+):\s*(.*)?$/);
    if (!keyMatch) { i++; continue; }

    const key = keyMatch[1];
    const rest = keyMatch[2]?.trim() ?? '';

    if (rest && rest !== '') {
      obj[key] = parseValue(rest);
      i++;
    } else {
      // Could be object or array
      const items = [];
      const nested = {};
      let isArray = false;
      let isObj = false;
      i++;
      while (i < lines.length) {
        const sub = lines[i];
        if (!sub.startsWith('  ')) break;
        const trimmed = sub.trimStart();
        if (trimmed.startsWith('- ')) {
          isArray = true;
          const itemLines = [trimmed.slice(2)];
          i++;
          while (i < lines.length && lines[i].startsWith('    ')) {
            itemLines.push(lines[i].trimStart());
            i++;
          }
          const itemObj = {};
          for (const il of itemLines) {
            const m = il.match(/^(\w+):\s*(.*)$/);
            if (m) itemObj[m[1]] = parseValue(m[2]);
          }
          items.push(Object.keys(itemObj).length === 1 ? Object.values(itemObj)[0] : itemObj);
        } else {
          isObj = true;
          const m = trimmed.match(/^(\w+):\s*(.*)$/);
          if (m) nested[m[1]] = parseValue(m[2]);
          i++;
        }
      }
      obj[key] = isArray ? items : (isObj ? nested : null);
    }
  }
  return obj;
}

export function parseContact(fileContent) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: fileContent };
  return {
    frontmatter: parseYaml(match[1]),
    body: match[2],
  };
}

export function serializeContact({ frontmatter, body }) {
  return `---\n${serializeYaml(frontmatter)}\n---\n${body ?? ''}`;
}

// ─── Default frontmatter ──────────────────────────────────────────────────────

export function defaultFrontmatter({ email, slug, name, displayName, role, scores, answers }) {
  return {
    email: email ?? '',
    slug: slug ?? '',
    name: name ?? '',
    displayName: displayName ?? name ?? '',
    role: role ?? 'lead',
    scores: scores ?? null,
    answers: answers ?? null,
    level: 1,
    xp: 0,
    homework: null,
    wins: [],
    context: '',
    savedAt: new Date().toISOString(),
  };
}

// ─── Stub body for auto-created contacts ─────────────────────────────────────

function stubBody({ name, email }) {
  return `# ${name || email}\n\n_Auto-created from Skill Tree submission._\n\n## Agent Log\n`;
}

// ─── Load / save contact ──────────────────────────────────────────────────────

export async function loadContact(slug) {
  const file = await ghGet(`${CONTACTS_DIR}/${slug}.md`);
  if (!file) return null;
  const parsed = parseContact(file.content);
  return { ...parsed, sha: file.sha };
}

export async function saveContact({ frontmatter, body, sha }, message = 'agent update') {
  frontmatter.savedAt = new Date().toISOString();
  const content = serializeContact({ frontmatter, body });
  const newSha = await ghPut(
    `${CONTACTS_DIR}/${frontmatter.slug}.md`,
    content,
    sha ?? null,
    message
  );
  return newSha;
}

// ─── Create a new contact ─────────────────────────────────────────────────────

export async function createContact({ email, name, displayName, role, scores, answers }) {
  const slug = name ? slugFromName(name) : slugFromEmail(email);
  const fm = defaultFrontmatter({ email, slug, name, displayName, role, scores, answers });
  const body = stubBody({ name, email });
  const sha = await ghPut(
    `${CONTACTS_DIR}/${slug}.md`,
    serializeContact({ frontmatter: fm, body }),
    null,
    `create contact: ${slug}`
  );
  return { frontmatter: fm, body, sha, slug };
}

// ─── Apply agent context update ───────────────────────────────────────────────

export function applyUpdate(contact, update) {
  const fm = { ...contact.frontmatter };
  const now = new Date().toISOString();

  if (update.wins?.length) {
    fm.wins = [
      ...(Array.isArray(fm.wins) ? fm.wins : []),
      ...update.wins.map(text => ({ text, loggedAt: now })),
    ];
    const gained = update.wins.length * 10;
    fm.xp = (fm.xp ?? 0) + gained;
    fm.level = Math.floor(fm.xp / 50) + 1;
  }

  if (update.homework) {
    fm.homework = { text: update.homework, assignedAt: now, completed: false };
  }

  if (update.notes) {
    fm.context = fm.context
      ? `${fm.context}\n\n[${now}]\n${update.notes}`
      : `[${now}]\n${update.notes}`;
  }

  return { ...contact, frontmatter: fm };
}

// ─── Feed event helper ────────────────────────────────────────────────────────

export function buildFeedEvents(slug, displayName, prevFm, nextFm, update) {
  const events = [];
  const ts = new Date().toISOString();

  if (update.wins?.length) {
    events.push({
      ts, contact: slug, name: displayName,
      event: 'xp',
      wins: update.wins,
      xpGained: update.wins.length * 10,
      xpTotal: nextFm.xp,
      levelBefore: prevFm.level ?? 1,
      levelAfter: nextFm.level,
    });
  }

  if (update.homework) {
    events.push({
      ts, contact: slug, name: displayName,
      event: 'homework',
      text: update.homework,
    });
  }

  return events;
}
