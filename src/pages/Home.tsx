import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import type { GitHubProject } from '../types';
import { GithubIcon, ArrowIcon } from '../components/Icons';

/* ── Animated hero background blobs ─────────────────────────── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="hero-blob w-[clamp(400px,55vw,700px)] h-[clamp(400px,55vw,700px)]
                      bg-indigo-600/30 -top-20 -left-20 animate-blob" />
      <div className="hero-blob w-[clamp(500px,65vw,850px)] h-[clamp(500px,65vw,850px)]
                      bg-sky-500/20 top-1/4 -right-32 animate-blob-slow"
           style={{ animationDelay: '-5s' }} />
      <div className="hero-blob w-[clamp(300px,38vw,520px)] h-[clamp(300px,38vw,520px)]
                      bg-violet-600/20 bottom-10 left-1/4 animate-blob-fast"
           style={{ animationDelay: '-9s' }} />
      <div className="dot-grid" />
    </div>
  );
}

/* ── Stats band ─────────────────────────────────────────────── */
function StatsBand({ dataset }: { dataset: ReturnType<typeof useProjects>['dataset'] }) {
  const projects  = dataset?.projects ?? [];
  const langCount = new Set(projects.map(p => p.language).filter(Boolean)).size;
  const stars     = projects.reduce((s, p) => s + p.stars, 0);

  return (
    <section className="bg-bg-surface border-y border-white/[0.04] py-4"
             aria-label="Repository statistics">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <dl className="flex flex-wrap items-center justify-center">
          {[
            { id: 'repos', val: projects.length, label: 'Public Repos' },
            { id: 'langs', val: langCount,        label: 'Languages' },
            { id: 'stars', val: stars,             label: 'Total Stars' },
          ].map(({ id, val, label }, i) => (
            <div key={id} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5 px-6 py-3 flex-1 min-w-[7rem]">
                <dd className="text-3xl sm:text-4xl font-extrabold text-slate-100 tabular-nums">
                  {dataset ? val : '—'}
                </dd>
                <dt className="text-[0.65rem] font-semibold text-slate-600 uppercase tracking-widest">
                  {label}
                </dt>
              </div>
              {i < 2 && (
                <div className="w-px h-9 bg-white/[0.04] self-center flex-shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
          <div className="w-px h-9 bg-white/[0.04] self-center flex-shrink-0 hidden sm:block" />
          <div className="flex flex-col items-center gap-0.5 px-6 py-3 min-w-[7rem]">
            <dd className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-slate-100">
              <span className="live-dot" />Live
            </dd>
            <dt className="text-[0.65rem] font-semibold text-slate-600 uppercase tracking-widest">
              GitHub Sync
            </dt>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ── Skeleton cards ─────────────────────────────────────────── */
function Skeletons({ count, tall = false }: { count: number; tall?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${tall ? 'h-60' : 'h-48'}`} aria-hidden="true" />
      ))}
    </>
  );
}

/* ── Home page ──────────────────────────────────────────────── */
export default function Home() {
  const { dataset, status } = useProjects();
  const [activeModal, setActiveModal] = useState<GitHubProject | null>(null);

  const featuredProjects = dataset?.featuredProjects ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
               aria-labelledby="hero-heading">
        <HeroBackground />

        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8
                        text-center pt-20 pb-24">
          <div className="animate-fade-up-1">
            <span className="pill mb-8 inline-flex">
              <span className="hero-dot" />
              AI Engineer &nbsp;·&nbsp; Builder &nbsp;·&nbsp; Open Source
            </span>
          </div>

          <h1 id="hero-heading"
              className="text-[clamp(3.5rem,11vw,8.5rem)] font-black leading-[0.92]
                         tracking-tight mb-6 animate-fade-up-2">
            <span className="block gradient-text">Karan</span>
            <span className="block gradient-text">Gehlod</span>
          </h1>

          <p className="text-[clamp(1rem,2.2vw,1.2rem)] text-slate-400 leading-relaxed
                        max-w-2xl mx-auto mb-10 animate-fade-up-3">
            Building intelligent systems at the intersection of agentic AI, RAG pipelines,
            and production ML. Turning research into reliable, scalable software.
          </p>

          <div className="flex flex-wrap gap-3 justify-center animate-fade-up-4">
            <Link to="/projects"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                             font-semibold text-sm text-white gradient-bg
                             shadow-lg shadow-indigo-500/30
                             hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/50
                             transition-all duration-300">
              Explore Projects
            </Link>
            <Link to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                             font-semibold text-sm text-slate-100
                             border border-indigo-500/20 bg-white/[0.03]
                             hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300
                             hover:-translate-y-1 transition-all duration-300">
              About Me
            </Link>
            <a href="https://github.com/karangehlod"
               target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                          font-semibold text-sm text-slate-400
                          border border-white/[0.06] bg-white/[0.02]
                          hover:text-slate-100 hover:border-white/10 hover:-translate-y-1
                          transition-all duration-300">
              <GithubIcon /> GitHub
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-2 text-slate-600 animate-fade-up-5"
             aria-hidden="true">
          <span className="text-[0.6rem] tracking-[0.14em] uppercase leading-none">Scroll</span>
          <div className="scroll-bar" />
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsBand dataset={dataset} />

      {/* ── Featured projects ── */}
      {(status !== 'error') && (
        <section className="py-24 sm:py-32" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="max-w-lg mb-12 reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
                Highlighted work
              </p>
              <h2 id="featured-heading"
                  className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                Featured projects
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Curated selection of my most significant open-source work.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {status === 'loading'
                ? <Skeletons count={3} tall />
                : featuredProjects.length > 0
                  ? featuredProjects.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={i} onInfo={setActiveModal} />
                    ))
                  : null
              }
            </div>

            <div className="text-center">
              <Link to="/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm
                               font-semibold text-indigo-400 border border-indigo-500/25
                               hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-300
                               transition-all duration-200">
                View all repositories <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── About teaser ── */}
      <section className="py-24 border-t border-white/[0.04]" aria-labelledby="about-teaser-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
              Who I am
            </p>
            <h2 id="about-teaser-heading"
                className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Building the <span className="gradient-text">AI layer</span>
            </h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
              <p>
                Senior AI Engineer specialising in production autonomous systems —
                multi-agent orchestration, RAG pipelines, and cloud-native AI platforms.
                Delivered <strong className="text-slate-200">$250K+ impact</strong> at Johnson Controls.
              </p>
              <p>
                Everything I build is designed to be observable, testable, and
                deployable — not just a notebook experiment.
              </p>
            </div>
            <Link to="/about"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold
                             text-indigo-400 hover:text-indigo-300 transition-colors group">
              More about me
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute inset-0 gradient-bg opacity-30 blur-3xl rounded-3xl scale-110"
                   aria-hidden="true" />
              <img src="/profile_image.png"
                   alt="Karan Gehlod"
                   width="320" height="320"
                   loading="lazy"
                   className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80
                              rounded-3xl object-cover object-top
                              ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20" />
            </div>
          </div>
        </div>
      </section>

      <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}
