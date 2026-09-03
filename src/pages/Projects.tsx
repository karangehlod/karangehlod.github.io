import { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useContributions } from '../hooks/useContributions';
import { ProjectCard } from '../components/ProjectCard';
import { PortfolioCard } from '../components/PortfolioCard';
import { portfolioProjects } from '../data/portfolioProjects';
import { getLangColor, formatMonth } from '../utils/languageColors';

function Skeletons({ count, tall = false }: { count: number; tall?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${tall ? 'h-56' : 'h-48'}`} aria-hidden="true" />
      ))}
    </>
  );
}

export default function Projects() {
  const { dataset, status } = useProjects();
  const { dataset: contribData, status: contribStatus } = useContributions();
  const [activeFilter, setActiveFilter] = useState('');

  const projects  = dataset?.projects ?? [];
  const featured  = dataset?.featuredProjects ?? [];
  const langCount = new Set(projects.map(p => p.language).filter(Boolean)).size;

  const languages = useMemo(
    () => [...new Set(projects.map(p => p.language).filter(Boolean))].sort(),
    [projects]
  );

  const filtered = useMemo(
    () => activeFilter ? projects.filter(p => p.language === activeFilter) : projects,
    [projects, activeFilter]
  );

  return (
    <>
      {/* ── Page hero ── */}
      <section className="relative pt-40 pb-20 overflow-hidden" aria-labelledby="projects-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[600px] h-[600px] bg-indigo-600/20 -top-40 -left-28 animate-blob" />
          <div className="hero-blob w-[400px] h-[400px] bg-sky-600/15 top-0 right-0 animate-blob-slow"
               style={{ animationDelay: '-7s' }} />
          <div className="dot-grid" />
        </div>

        <div 
             className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3 animate-fade-up-1">
            Open source
          </p>
          <h1 id="projects-heading"
              className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-up-2">
            <span className="text-slate-100">All</span>
            <span className="gradient-text"> Projects</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-8 animate-fade-up-3">
            Every public repository — discovered live from the GitHub API at each build.
            No stale lists, no manual curation of existence.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up-4">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm
                             bg-white/[0.04] border border-white/[0.07] text-slate-300">
              <span className="live-dot" />Live GitHub sync
            </span>
            <span className="px-4 py-2 rounded-full text-sm bg-white/[0.04]
                             border border-white/[0.07] text-slate-400">
              <span className="font-bold text-slate-100">
                {status === 'ready' ? projects.length : '—'}
              </span> repositories
            </span>
            <span className="px-4 py-2 rounded-full text-sm bg-white/[0.04]
                             border border-white/[0.07] text-slate-400">
              <span className="font-bold text-slate-100">
                {status === 'ready' ? langCount : '—'}
              </span> languages
            </span>
          </div>
        </div>
      </section>

      {/* ── Professional Portfolio ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="portfolio-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
              Professional work
            </p>
            <h2 id="portfolio-heading"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Portfolio projects
            </h2>
            <p className="text-slate-500 text-sm">
              Production projects delivered at Johnson Controls — click any card for full details.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioProjects.map(p => (
              <PortfolioCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured GitHub repos ── */}
      {status !== 'error' && (
        <section className="py-16 border-t border-white/[0.04]" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header 
                    className="flex items-end justify-between mb-10 reveal">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
                  Highlighted work
                </p>
                <h2 id="featured-heading"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Featured
                </h2>
              </div>
              <span className="text-sm text-slate-500 hidden sm:block">
                Curated from current public repositories
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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

      {/* ── All repos ── */}
      {status !== 'error' && (
        <section className="py-16 border-t border-white/[0.04]" aria-labelledby="all-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header 
                    className="mb-10 reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
                Complete list
              </p>
              <h2 id="all-heading"
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                All repositories
              </h2>
            </header>

            {/* Language filter */}
            {languages.length > 0 && (
              <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filter by language">
                <button
                  type="button"
                  onClick={() => setActiveFilter('')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs
                              font-medium border transition-all duration-200
                              ${activeFilter === ''
                                ? 'bg-indigo-500/12 border-indigo-500/40 text-indigo-300'
                                : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-100 hover:bg-indigo-500/8 hover:border-indigo-500/30'}`}
                >
                  All
                </button>
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveFilter(lang === activeFilter ? '' : lang)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs
                                font-medium border transition-all duration-200
                                ${lang === activeFilter
                                  ? 'bg-indigo-500/12 border-indigo-500/40 text-indigo-300'
                                  : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-100 hover:bg-indigo-500/8 hover:border-indigo-500/30'}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: getLangColor(lang) }} />
                    {lang}
                  </button>
                ))}
              </nav>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {status === 'loading'
                ? <Skeletons count={8} />
                : filtered.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {status === 'error' && (
        <section className="py-32">
          <div className="max-w-lg mx-auto px-4 text-center">
            <p className="text-5xl mb-4 opacity-40" aria-hidden="true">📡</p>
            <p className="text-slate-500">
              Could not load repository data. Please try again later.
            </p>
          </div>
        </section>
      )}

      {/* ── Open-source contributions to other repos ── */}
      {contribStatus !== 'error' && (
        <section className="py-16 border-t border-white/[0.04]" aria-labelledby="contrib-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-10 reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
                Community work
              </p>
              <h2 id="contrib-heading"
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                Open-source contributions
              </h2>
              <p className="text-slate-500 text-sm">
                Merged pull requests to external repositories.
              </p>
            </header>

            {contribStatus === 'loading' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeletons count={6} />
              </div>
            )}

            {contribStatus === 'ready' && contribData && contribData.contributions.length === 0 && (
              <p className="text-slate-500 text-sm">No public contributions found yet.</p>
            )}

            {contribStatus === 'ready' && contribData && contribData.contributions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contribData.contributions.map((c, i) => (
                  <a key={c.id}
                     href={c.url}
                     target="_blank" rel="noopener noreferrer"
                     className="group flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300
                                hover:-translate-y-1 bg-white/[0.02] border-white/[0.06]
                                hover:border-indigo-500/30 hover:bg-white/[0.04]"
                     style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      <a href={c.repoUrl} target="_blank" rel="noopener noreferrer"
                         className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 truncate transition-colors"
                         onClick={e => e.stopPropagation()}>
                        {c.repo}
                      </a>
                    </div>
                    <p className="text-sm font-medium text-slate-200 leading-snug
                                  group-hover:text-indigo-300 transition-colors flex-1 line-clamp-2">
                      {c.title}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-auto pt-2
                                    border-t border-white/[0.05]">
                      <div className="flex items-center gap-3 flex-wrap">
                        {c.language && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: getLangColor(c.language) }} />
                            {c.language}
                          </span>
                        )}
                        {c.stars > 0 && (
                          <span className="text-xs text-slate-500">★ {c.stars}</span>
                        )}
                        {c.mergedAt && (
                          <span className="text-xs text-slate-500">{formatMonth(c.mergedAt)}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem]
                                       font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex-shrink-0">
                        Merged
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
