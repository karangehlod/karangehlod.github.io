const GITHUB_API_ROOT = 'https://api.github.com';

export function isPublicRepository(repo, owner) {
  return Boolean(
    repo &&
      repo.name &&
      repo.visibility === 'public' &&
      repo.owner?.login?.toLowerCase() === owner.toLowerCase()
  );
}

export function filterVisibleRepositories(repositories, config) {
  const excluded = new Set((config.excludedRepos ?? []).map((name) => name.toLowerCase()));

  return repositories.filter((repo) => {
    if (!isPublicRepository(repo, config.owner)) return false;
    if (excluded.has(repo.name.toLowerCase())) return false;
    if (!config.includeForks && repo.fork) return false;
    if (!config.includeArchived && repo.archived) return false;
    return true;
  });
}

export function normalizeRepository(repo, featuredRepos = []) {
  const featured = new Set(featuredRepos.map((name) => name.toLowerCase()));
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? '',
    url: repo.html_url,
    homepage: repo.homepage ?? '',
    language: repo.language ?? '',
    topics: repo.topics ?? [],
    fork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    stars: repo.stargazers_count ?? 0,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    featured: featured.has(repo.name.toLowerCase()),
    slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  };
}

export function buildProjectDataset(repositories, config) {
  const visible = filterVisibleRepositories(repositories, config);
  const projects = visible.map((repo) => normalizeRepository(repo, config.featuredRepos));
  const byName = new Set(projects.map((project) => project.name.toLowerCase()));
  const unavailableFeatured = config.featuredRepos.filter((name) => !byName.has(name.toLowerCase()));

  return {
    generatedAt: new Date().toISOString(),
    owner: config.owner,
    projects,
    featuredProjects: projects.filter((project) => project.featured),
    unavailableFeatured,
    stats: {
      fetched: repositories.length,
      public: repositories.filter((repo) => isPublicRepository(repo, config.owner)).length,
      excluded: repositories.length - visible.length,
      featuredPublic: projects.filter((project) => project.featured).length,
      featuredUnavailable: unavailableFeatured.length,
    },
  };
}

function parseNextLink(linkHeader) {
  if (!linkHeader) return undefined;
  const next = linkHeader.split(',').find((part) => part.includes('rel="next"'));
  return next?.match(/<([^>]+)>/)?.[1];
}

export async function fetchPublicRepositories(owner, fetchImpl = fetch, token = process.env.GITHUB_TOKEN) {
  const repositories = [];
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  let url = `${GITHUB_API_ROOT}/users/${owner}/repos?per_page=100&type=owner&sort=updated`;

  while (url) {
    const response = await fetchImpl(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': `${owner}-project-discovery`,
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub repository discovery failed with ${response.status} ${response.statusText}`);
    }

    repositories.push(...(await response.json()));
    url = parseNextLink(response.headers.get('link'));
  }

  return repositories;
}

export function logDiscoverySummary(dataset, logger = console) {
  logger.log('GitHub repository discovery:');
  logger.log(`Fetched: ${dataset.stats.fetched} repositories`);
  logger.log(`Public: ${dataset.stats.public}`);
  logger.log(`Excluded: ${dataset.stats.excluded}`);
  logger.log(`Featured/public: ${dataset.stats.featuredPublic}`);
  logger.log(`Featured/unavailable: ${dataset.stats.featuredUnavailable}`);
  for (const name of dataset.unavailableFeatured) {
    logger.warn(`Warning: configured featured repository "${name}" was not found or is not publicly accessible. Skipping.`);
  }
}
