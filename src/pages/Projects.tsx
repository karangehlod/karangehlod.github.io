import { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useContributions } from '../hooks/useContributions';
import { ProjectCard, RepoRow } from '../components/ProjectCard';
import { PortfolioCard } from '../components/PortfolioCard';
import { portfolioProjects } from '../data/portfolioProjects';
import { GithubIcon } from '../components/Icons';
import { getLangColor, formatMonth } from '../utils/languageColors';

function plainText(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function Skeletons({ count, tall = false }: { count: number; tall?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${tall ? 'h-56' : 'h-48'}`} aria-hidden="true" />
      ))}
    </>
  );
}

const SORTS = [
  { id: 'recent', label: 'Recent' },
  { id: 'stars',  label: 'Stars'  },
  { id: 'name',   label: 'Name'   },
] as const;
type SortId = typeof SORTS[number]['id'];

export default function Projects() {
  const { dataset, status } = useProjects();
  const { dataset: contribData, status: contribStatus } = useContributions();
  const [activeFilter, setActiveFilter] = useState('');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortId>('recent');

  const projects  = dataset?.projects ?? [];
  const featured  = dataset?.featuredProjects ?? [];
  const langCount = new Set(projects.map(p => p.language).filter(Boolean)).size;

  const languages = useMemo(
    () => [...new Set(projects.map(p => p.language).filter(Boolean))].sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter(p =>
      (!activeFilter || p.language === activeFilter) &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        p.topics.some(t => t.toLowerCase().includes(q)))
    );
    return [...list].sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars || a.name.localeCompare(b.name);
      if (sortBy === 'name')  return a.name.localeCompare(b.name);
      return Date.parse(b.pushedAt || b.updatedAt) - Date.parse(a.pushedAt || a.updatedAt);
    });
  }, [projects, activeFilter, query, sortBy]);

  return (
    <>
      {/* ── Page hero ── */}
      <section className="relative pt-36 pb-16 overflow-hidden" aria-labelledby="projects-heading">
        <div className="draft-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Projects</span></div>
          <h1 id="projects-heading"
              className="display-wide text-5xl sm:text-7xl text-ink mb-6 fx-head">
            All projects
          </h1>
          <p className="text-lg text-mut leading-relaxed max-w-[56ch] mb-8 fx-rise" style={{ '--fxd': '150ms' } as React.CSSProperties}>
            Every public repository, discovered live from the GitHub API at each
            build - no stale lists and no manual curation.
          </p>

          {/* Inline readout facts */}
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-4 max-w-2xl fx-rise" style={{ '--fxd': '250ms' } as React.CSSProperties}>
            <div>
              <dd className="font-mono text-xl font-semibold text-ink tabular-nums">
                {status === 'ready' ? projects.length : '-'}
              </dd>
              <dt className="text-xs text-fnt">repositories</dt>
            </div>
            <div>
              <dd className="font-mono text-xl font-semibold text-ink tabular-nums">
                {status === 'ready' ? langCount : '-'}
              </dd>
              <dt className="text-xs text-fnt">languages</dt>
            </div>
            {contribStatus === 'ready' && contribData && (
              <div>
                <dd className="font-mono text-xl font-semibold text-tel tabular-nums">
                  {contribData.total}
                </dd>
                <dt className="text-xs text-fnt">OSS PRs merged</dt>
              </div>
            )}
            <div>
              <dd className="flex items-center gap-2 font-mono text-xl font-semibold text-ink">
                <span className="w-2 h-2 rounded-full bg-tel animate-pulse" aria-hidden="true" />
                live
              </dd>
              <dt className="text-xs text-fnt">GitHub sync</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Open-source contributions ── */}
      {contribStatus !== 'error' && (
        <section className="py-16" aria-labelledby="contrib-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="node-rule fx-rule mb-8"><span>Open source</span></div>
            <header className="mb-10 flex items-end justify-between flex-wrap gap-4">
              <div>
                <h2 id="contrib-heading" className="display text-3xl sm:text-4xl text-ink mb-2 fx-head">
                  Contributions to external projects
                </h2>
                <p className="text-fnt text-sm max-w-[60ch]">
                  Merged pull requests to repositories I don't own - real code
                  shipped to tools other developers depend on.
                </p>
              </div>
              <a href="https://github.com/pulls?q=is%3Apr+is%3Amerged+author%3Akarangehlod+-user%3Akarangehlod"
                 target="_blank" rel="noopener noreferrer"
                 className="tlink text-xs font-semibold whitespace-nowrap">
                View on GitHub
              </a>
            </header>

            {contribStatus === 'loading' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeletons count={6} />
              </div>
            )}

            {contribStatus === 'ready' && contribData && contribData.contributions.length === 0 && (
              <p className="text-fnt text-sm">No public contributions found yet.</p>
            )}

            {contribStatus === 'ready' && contribData && contribData.contributions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contribData.contributions.map((c, i) => (
                  <a key={c.id}
                     href={c.url}
                     target="_blank" rel="noopener noreferrer"
                     className="panel panel-hover group flex flex-col gap-3 p-5 fx-rise"
                     style={{ '--fxd': `${i * 90}ms` } as React.CSSProperties}>

                    {/* Repo name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <GithubIcon className="w-3.5 h-3.5 flex-shrink-0 text-fnt" />
                      <span className="text-xs font-semibold text-mut truncate">{c.repo}</span>
                      {c.stars > 0 && (
                        <span className="ml-auto text-xs font-mono text-fnt flex-shrink-0">★ {c.stars}</span>
                      )}
                    </div>

                    {/* PR title */}
                    <p className="text-sm font-medium text-ink leading-snug flex-1 line-clamp-2
                                  group-hover:text-signal transition-colors">
                      {c.title}
                    </p>

                    {/* PR body excerpt */}
                    {c.body && (
                      <p className="text-xs text-fnt leading-relaxed line-clamp-2">
                        {plainText(c.body)}
                      </p>
                    )}

                    {/* Code impact row */}
                    {(c.additions > 0 || c.deletions > 0 || c.changedFiles > 0) && (
                      <div className="flex items-center gap-3 flex-wrap font-mono text-[11px]">
                        {c.additions > 0 && (
                          <span className="font-semibold text-tel whitespace-nowrap">
                            +{c.additions.toLocaleString()}
                          </span>
                        )}
                        {c.deletions > 0 && (
                          <span className="font-semibold text-alert whitespace-nowrap">
                            -{c.deletions.toLocaleString()}
                          </span>
                        )}
                        {c.changedFiles > 0 && (
                          <span className="text-fnt whitespace-nowrap">
                            {c.changedFiles} file{c.changedFiles !== 1 ? 's' : ''}
                          </span>
                        )}
                        {c.commits > 0 && (
                          <span className="text-fnt whitespace-nowrap">
                            {c.commits} commit{c.commits !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-2
                                    border-t border-line">
                      <div className="flex items-center gap-3 text-xs text-fnt flex-wrap">
                        {c.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: getLangColor(c.language) }} />
                            {c.language}
                          </span>
                        )}
                        {c.mergedAt && <span className="font-mono">{formatMonth(c.mergedAt)}</span>}
                      </div>
                      <span className="chip chip-ok flex-shrink-0">Merged</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Professional portfolio ── */}
      <section className="py-16" aria-labelledby="portfolio-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Professional work</span></div>
          <header className="mb-10">
            <h2 id="portfolio-heading" className="display text-3xl sm:text-4xl text-ink mb-2 fx-head">
              Portfolio projects
            </h2>
            <p className="text-fnt text-sm">
              Production projects delivered at Johnson Controls - open any card
              for the full case.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioProjects.map((p, i) => (
              <PortfolioCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured GitHub repos ── */}
      {status !== 'error' && (
        <section className="py-16" aria-labelledby="featured-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="node-rule fx-rule mb-8"><span>Featured</span></div>
            <header className="flex items-end justify-between mb-10">
              <h2 id="featured-heading" className="display text-3xl sm:text-4xl text-ink fx-head">
                Featured repositories
              </h2>
              <span className="text-sm text-fnt hidden sm:block">
                Curated from current public repositories
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {status === 'loading'
                ? <Skeletons count={3} tall />
                : featured.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── All repos - ledger index ── */}
      {status !== 'error' && (
        <section className="py-16" aria-labelledby="all-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="node-rule fx-rule mb-8"><span>Complete index</span></div>
            <header className="mb-8">
              <h2 id="all-heading" className="display text-3xl sm:text-4xl text-ink fx-head">
                All repositories
              </h2>
            </header>

            {/* Search + sort controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fnt pointer-events-none"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Filter by name, topic, description"
                  aria-label="Filter repositories"
                  className="w-72 max-w-full pl-9 pr-3 py-2 rounded-md text-sm
                             bg-panel border border-line text-ink placeholder:text-fnt
                             outline-none focus:border-signal transition-colors"
                />
              </div>

              <div className="flex items-center rounded-md border border-line p-0.5"
                   role="group" aria-label="Sort repositories">
                {SORTS.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id)}
                    aria-pressed={sortBy === s.id}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
                      ${sortBy === s.id
                        ? 'bg-panel-hi text-ink'
                        : 'text-fnt hover:text-ink'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {status === 'ready' && (
                <span className="text-xs font-mono text-fnt ml-auto">
                  {filtered.length} of {projects.length}
                </span>
              )}
            </div>

            {/* Language filter */}
            {languages.length > 0 && (
              <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filter by language">
                <button
                  type="button"
                  onClick={() => setActiveFilter('')}
                  className={`chip transition-colors ${activeFilter === ''
                    ? 'chip-signal'
                    : 'hover:text-ink hover:border-line-strong'}`}
                >
                  All
                </button>
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveFilter(lang === activeFilter ? '' : lang)}
                    className={`chip transition-colors ${lang === activeFilter
                      ? 'chip-signal'
                      : 'hover:text-ink hover:border-line-strong'}`}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: getLangColor(lang) }} />
                    {lang}
                  </button>
                ))}
              </nav>
            )}

            {status === 'loading' ? (
              <div className="space-y-2">
                <Skeletons count={6} />
              </div>
            ) : filtered.length > 0 ? (
              <div>
                {filtered.map((p, i) => (
                  <RepoRow key={p.id} project={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="panel border-dashed p-8">
                <p className="text-ink font-semibold mb-1">No repositories match</p>
                <p className="text-sm text-mut mb-4">
                  Nothing matches "{query.trim()}"{activeFilter ? ` in ${activeFilter}` : ''}.
                </p>
                <button type="button"
                        onClick={() => { setQuery(''); setActiveFilter(''); }}
                        className="tlink text-sm font-semibold">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Error state */}
      {status === 'error' && (
        <section className="py-32">
          <div className="max-w-lg mx-auto px-4">
            <div className="panel p-8">
              <p className="text-ink font-semibold mb-1">Repository data didn't load</p>
              <p className="text-mut text-sm">
                GitHub may be unreachable right now. Reload the page to try again.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
