import { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { PortfolioCard } from '../components/PortfolioCard';
import { portfolioProjects } from '../data/portfolioProjects';
import type { GitHubProject } from '../types';
import { getLangColor } from '../utils/languageColors';

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
  const [activeFilter, setActiveFilter] = useState('');
  const [activeModal, setActiveModal]   = useState<GitHubProject | null>(null);

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
                    <ProjectCard key={p.id} project={p} index={i} onInfo={setActiveModal} />
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
                    <ProjectCard key={p.id} project={p} index={i} onInfo={setActiveModal} />
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

      <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}
