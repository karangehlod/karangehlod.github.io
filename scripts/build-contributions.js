import { mkdir, writeFile } from 'node:fs/promises';

const OWNER = 'karangehlod';
const GITHUB_API_ROOT = 'https://api.github.com';
// Prefer GH_PAT (full scope) over the default github.token (limited scope)
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
const outputPath = new URL('../public/contributions.json', import.meta.url);

const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
const commonHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${OWNER}-portfolio`,
  ...authHeaders,
};

async function fetchContributions() {
  const query = `is:pr is:merged author:${OWNER} -user:${OWNER}`;
  const url = `${GITHUB_API_ROOT}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=30`;

  const response = await fetch(url, { headers: commonHeaders });
  if (!response.ok) {
    throw new Error(`GitHub search API failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function enrichWithRepoInfo(repoFullName) {
  const url = `${GITHUB_API_ROOT}/repos/${repoFullName}`;
  try {
    const res = await fetch(url, { headers: commonHeaders });
    if (!res.ok) return null;
    const data = await res.json();
    return { stars: data.stargazers_count ?? 0, language: data.language ?? '' };
  } catch {
    return null;
  }
}

async function enrichWithPRStats(prApiUrl) {
  try {
    const res = await fetch(prApiUrl, { headers: commonHeaders });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      additions: data.additions ?? 0,
      deletions: data.deletions ?? 0,
      changedFiles: data.changed_files ?? 0,
      commits: data.commits ?? 0,
      body: typeof data.body === 'string' ? data.body.slice(0, 300).trim() : '',
    };
  } catch {
    return null;
  }
}

const fallback = { generatedAt: new Date().toISOString(), contributions: [], total: 0 };

try {
  const data = await fetchContributions();

  const raw = (data.items ?? []).filter(item => item.pull_request?.merged_at);

  const repoNames = [...new Set(raw.map(item =>
    item.repository_url.replace(`${GITHUB_API_ROOT}/repos/`, '')
  ))];

  // Fetch repo metadata (stars, language) for each unique repo
  const repoMeta = {};
  for (const name of repoNames) {
    const meta = await enrichWithRepoInfo(name);
    if (meta) repoMeta[name] = meta;
    await new Promise(r => setTimeout(r, 120));
  }

  // Fetch PR stats (additions, deletions, files changed, commits) per PR
  const prStats = {};
  for (const item of raw) {
    const prUrl = item.pull_request?.url;
    if (prUrl) {
      const stats = await enrichWithPRStats(prUrl);
      if (stats) prStats[item.id] = stats;
      await new Promise(r => setTimeout(r, 120));
    }
  }

  const contributions = raw.map(item => {
    const repo = item.repository_url.replace(`${GITHUB_API_ROOT}/repos/`, '');
    const stats = prStats[item.id] ?? {};
    return {
      id: item.id,
      number: item.number,
      title: item.title,
      url: item.html_url,
      repo,
      repoUrl: item.html_url.split('/pull/')[0],
      mergedAt: item.pull_request.merged_at,
      labels: item.labels.map(l => l.name),
      stars: repoMeta[repo]?.stars ?? 0,
      language: repoMeta[repo]?.language ?? '',
      additions: stats.additions ?? 0,
      deletions: stats.deletions ?? 0,
      changedFiles: stats.changedFiles ?? 0,
      commits: stats.commits ?? 0,
      body: stats.body ?? '',
    };
  });

  const dataset = { generatedAt: new Date().toISOString(), contributions, total: contributions.length };
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
  console.log(`Saved ${contributions.length} open-source contributions.`);
} catch (err) {
  console.warn('[build-contributions] Failed to fetch contributions:', err.message);
  console.warn('Writing empty fallback contributions.json');
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(fallback, null, 2)}\n`);
}
