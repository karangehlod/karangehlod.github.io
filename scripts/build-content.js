/**
 * build-content.js
 * Reads content/profile.md (YAML frontmatter + markdown body)
 * and writes public/content.json for the frontend to fetch.
 *
 * Also fetches ORCID publications if an ORCID ID is set in the frontmatter.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { URL }                                     from 'node:url';
import matter                                      from 'gray-matter';

const SRC  = new URL('../content/profile.md',      import.meta.url);
const DEST = new URL('../public/content.json',     import.meta.url);
const PUB  = new URL('../public/publications.json', import.meta.url);

/* ── Parse profile.md ────────────────────────────────────────── */
const raw  = readFileSync(SRC, 'utf8');
const { data, content } = matter(raw);

const output = {
  ...data,
  summaryMarkdown: content.replace(/^##\s+Summary\s*/i, '').trim(),
  generatedAt: new Date().toISOString(),
};

mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(DEST, JSON.stringify(output, null, 2) + '\n');
console.log('Content: wrote public/content.json');

/* ── Fetch ORCID publications (if orcid is set) ──────────────── */
const orcid = data.social?.orcid?.trim();

if (!orcid) {
  console.log('Publications: no ORCID set — skipping. Add `orcid: "0000-0002-XXXX-XXXX"` to content/profile.md to enable.');
  writeFileSync(PUB, JSON.stringify({ works: [], fetchedAt: new Date().toISOString() }) + '\n');
} else {
  console.log(`Publications: fetching ORCID ${orcid}…`);
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) throw new Error(`ORCID API ${res.status}: ${res.statusText}`);

    const json   = await res.json();
    const groups = json?.group ?? [];

    const works = groups.map(g => {
      const summary = g['work-summary']?.[0];
      if (!summary) return null;

      const title       = summary.title?.title?.value ?? '';
      const year        = summary['publication-date']?.year?.value ?? null;
      const journal     = summary['journal-title']?.value ?? '';
      const type        = summary.type ?? '';
      const orcidWorkId = summary['put-code'] ?? null;

      // External IDs (DOI, etc.)
      const extIds = (summary['external-ids']?.['external-id'] ?? []);
      const doi    = extIds.find(e => e['external-id-type'] === 'doi')?.['external-id-value'] ?? null;
      const url    = doi
        ? `https://doi.org/${doi}`
        : summary.url?.value ?? `https://orcid.org/${orcid}`;

      return { title, year, journal, type, doi, url, orcidWorkId };
    }).filter(Boolean);

    writeFileSync(PUB, JSON.stringify({ works, fetchedAt: new Date().toISOString() }, null, 2) + '\n');
    console.log(`Publications: wrote ${works.length} works to public/publications.json`);
  } catch (err) {
    console.warn(`Publications: ORCID fetch failed — ${err.message}. Writing empty list.`);
    writeFileSync(PUB, JSON.stringify({ works: [], fetchedAt: new Date().toISOString(), error: err.message }) + '\n');
  }
}
