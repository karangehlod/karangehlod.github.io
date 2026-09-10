import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useContributions } from '../hooks/useContributions';
import { useActivity } from '../hooks/useActivity';
import { ProjectCard } from '../components/ProjectCard';
import { ContributionCalendar } from '../components/ContributionCalendar';
import { GithubIcon, ArrowIcon } from '../components/Icons';
import { getLangColor, formatMonth } from '../utils/languageColors';

/* ── Section dot navigation (xl desktops only) ───────────────── */
const DOTS = [
  { id: 'sec-hero',     label: 'Home'        },
  { id: 'sec-about',    label: 'About'       },
  { id: 'sec-featured', label: 'Projects'    },
  { id: 'sec-oss',      label: 'Open Source' },
  { id: 'sec-activity', label: 'Activity'    },
];

export function SectionDots() {
  const [active, setActive] = useState('sec-hero');

  useEffect(() => {
    const update = () => {
      let current = DOTS[0].id;
      for (const { id } of DOTS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <nav aria-label="Page sections"
         className="fixed right-6 inset-y-0 z-40 hidden xl:flex flex-col items-end justify-center gap-0">
      {/* Vertical track */}
      <div className="absolute right-[5px] inset-y-0 w-px bg-white/[0.08]" aria-hidden="true" />

      {DOTS.map(({ id, label }, idx) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            aria-label={`Go to ${label}`}
            className="relative flex items-center justify-end gap-3 group outline-none py-3"
          >
            {/* Label: always visible for active, hover-only for inactive */}
            <div className={`flex flex-col items-end transition-all duration-300
              ${on ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}>
              {on && (
                <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-indigo-400 leading-none mb-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              )}
              <span className={`text-[11px] font-medium whitespace-nowrap leading-none
                ${on ? 'text-slate-100' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>

            {/* Dot */}
            <span className={`relative z-10 flex-shrink-0 rounded-full transition-all duration-300
              ${on
                ? 'w-[10px] h-[10px] bg-indigo-400 shadow-[0_0_10px_3px_rgba(99,102,241,0.55)]'
                : 'w-[6px] h-[6px] bg-white/50 group-hover:bg-white/80 group-hover:scale-125'}`} />
          </button>
        );
      })}
    </nav>
  );
}

/* ── Hero background ─────────────────────────────────────────── */
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
function StatsBand({
  dataset,
  ossTotal,
}: {
  dataset: ReturnType<typeof useProjects>['dataset'];
  ossTotal: number | null;
}) {
  const projects  = dataset?.projects ?? [];
  const langCount = new Set(projects.map(p => p.language).filter(Boolean)).size;
  const stars     = projects.reduce((s, p) => s + p.stars, 0);
  const ready     = !!(dataset || ossTotal !== null);

  const stats = [
    { id: 'repos', val: projects.length,  label: 'Public Repos'   },
    { id: 'langs', val: langCount,         label: 'Languages'      },
    { id: 'stars', val: stars,             label: 'Total Stars'    },
    { id: 'oss',   val: ossTotal ?? 0,     label: 'OSS PRs Merged' },
  ];

  return (
    <section className="bg-bg-surface border-y border-white/[0.04] py-3 sm:py-4"
             aria-label="Repository statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
          {stats.map(({ id, val, label }, i) => (
            <div key={id} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5 px-4 sm:px-6 py-3 w-full">
                <dd className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tabular-nums">
                  {ready ? val : '—'}
                </dd>
                <dt className="text-[0.6rem] font-semibold text-slate-600 uppercase tracking-widest text-center">
                  {label}
                </dt>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-8 bg-white/[0.04] self-center flex-shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
          <div className="w-px h-8 bg-white/[0.04] self-center flex-shrink-0 hidden sm:block" />
          <div className="col-span-2 sm:col-span-1 flex sm:block items-center justify-center
                          gap-0.5 px-4 sm:px-6 py-3 border-t border-white/[0.04] sm:border-0">
            <dd className="flex items-center gap-2 text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100
                           sm:flex-col sm:items-center sm:gap-2">
              <span className="live-dot" /><span>Live</span>
            </dd>
            <dt className="text-[0.6rem] font-semibold text-slate-600 uppercase tracking-widest
                           ml-2 sm:ml-0 sm:text-center sm:block">
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

/* ── Strip markdown for plain-text snippets ─────────────────── */
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

/* ── Achievement chip ────────────────────────────────────────── */
function Chip({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 px-5 py-3.5 rounded-2xl border ${accent}`}>
      <span className="text-xl sm:text-2xl font-extrabold tabular-nums leading-none">{value}</span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-slate-500 mt-0.5">
        {label}
      </span>
    </div>
  );
}

/* ── Home page ──────────────────────────────────────────────── */
export default function Home() {
  const { dataset, status }                      = useProjects();
  const { dataset: contribData }                 = useContributions();
  const { dataset: activityData, status: actSt } = useActivity();

  const featuredProjects = dataset?.featuredProjects ?? [];
  const ossTotal         = contribData ? contribData.total : null;
  const totalAdditions   = contribData
    ? contribData.contributions.reduce((s, c) => s + (c.additions ?? 0), 0)
    : 0;

  return (
    <>

      {/* ═══════════════════════════════════════════════════════
          1 · HERO — full viewport, centered, one message
      ══════════════════════════════════════════════════════════ */}
      <section id="sec-hero"
               className="snap-section-full relative flex flex-col
                          items-center justify-center overflow-hidden"
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

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-2 text-slate-600 animate-fade-up-5"
             aria-hidden="true">
          <span className="text-[0.6rem] tracking-[0.14em] uppercase leading-none">Scroll</span>
          <div className="scroll-bar" />
        </div>

        {/* Stats band pinned to bottom of hero — always visible on page 1 */}
        <div className="absolute bottom-0 inset-x-0 animate-fade-up-5">
          <StatsBand dataset={dataset} ossTotal={ossTotal} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2 · WHO I AM — photo left, identity right
      ══════════════════════════════════════════════════════════ */}
      {/* Photo fills full left half, content right — true split screen */}
      <section id="sec-about"
               className="snap-section-full overflow-hidden"
               aria-labelledby="about-heading">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* ── Left: full-height photo ── */}
          <div className="hidden lg:block relative section-reveal">
            {/* indigo glow overlay on the right edge */}
            <div className="absolute inset-y-0 right-0 w-32 z-10
                            bg-gradient-to-r from-transparent to-[#020817]"
                 aria-hidden="true" />
            <img src="/profile_image.png"
                 alt="Karan Gehlod"
                 className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>

          {/* ── Right: identity — vertically centered ── */}
          <div className="flex flex-col justify-center gap-6
                          px-8 sm:px-12 lg:px-16 py-24 lg:py-0">

            {/* mobile: small avatar */}
            <div className="lg:hidden flex justify-center mb-2">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 gradient-bg opacity-40 blur-xl rounded-full scale-150" />
                <img src="/profile_image.png" alt="Karan Gehlod"
                     className="relative w-24 h-24 rounded-full object-cover object-top
                                ring-2 ring-indigo-500/40" />
              </div>
            </div>

            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 section-reveal">
              Who I am
            </p>
            <div className="section-reveal">
              <h2 id="about-heading"
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2">
                Karan<br />Gehlod
              </h2>
              <p className="text-indigo-400 font-semibold text-lg">Senior AI Engineer</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-200 leading-snug section-reveal">
              Building the <span className="gradient-text">AI layer</span>
            </p>
            <p className="text-slate-400 text-lg leading-relaxed section-reveal">
              Specialising in production autonomous systems —
              multi-agent orchestration, RAG pipelines, and cloud-native AI platforms.
              Delivered <strong className="text-slate-200">$250K+ impact</strong> at Johnson Controls.
            </p>
            <div className="grid grid-cols-3 gap-3 section-reveal">
              <Chip value="$250K+" label="Business impact"
                    accent="border-indigo-500/25 bg-indigo-500/[0.08] text-indigo-300" />
              <Chip value="5+" label="Years in AI"
                    accent="border-sky-500/25 bg-sky-500/[0.08] text-sky-300" />
              <Chip value="15+" label="Public repos"
                    accent="border-violet-500/25 bg-violet-500/[0.08] text-violet-300" />
            </div>
            <div className="flex flex-wrap gap-3 section-reveal">
              <Link to="/about"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                               font-semibold text-sm text-white gradient-bg
                               shadow-lg shadow-indigo-500/30
                               hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/50
                               transition-all duration-300">
                More about me
              </Link>
              <Link to="/projects"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                               font-semibold text-sm text-slate-100
                               border border-indigo-500/20 bg-white/[0.03]
                               hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300
                               hover:-translate-y-1 transition-all duration-300">
                See projects <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3 · FEATURED PROJECTS
      ══════════════════════════════════════════════════════════ */}
      {status !== 'error' && (
        <section id="sec-featured"
                 className="snap-section-full border-t border-white/[0.04]
                            flex flex-col justify-center py-20 sm:py-24"
                 aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            {/* Section header */}
            <header className="mb-12 section-reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3">
                Highlighted work
              </p>
              <h2 id="featured-heading"
                  className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
                Featured projects
              </h2>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Open-source repos I'm most proud of — each solving a real problem in production AI.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 section-reveal">
              {status === 'loading'
                ? <Skeletons count={3} tall />
                : featuredProjects.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))
              }
            </div>

            <div className="section-reveal">
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

      {/* ═══════════════════════════════════════════════════════
          3 · OSS CONTRIBUTIONS
      ══════════════════════════════════════════════════════════ */}
      {contribData && contribData.contributions.length > 0 && (
        <section id="sec-oss"
                 className="snap-section-full border-t border-white/[0.04]
                            flex flex-col justify-center py-20 sm:py-24"
                 aria-labelledby="oss-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            <header className="mb-12 section-reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-emerald-400 mb-3">
                Community work
              </p>
              <h2 id="oss-heading"
                  className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
                Contributing to<br className="hidden sm:block" /> the ecosystem
              </h2>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Merged pull requests to external projects —&nbsp;
                {totalAdditions > 0 && (
                  <span className="text-emerald-400 font-semibold font-mono">
                    +{totalAdditions.toLocaleString()} lines
                  </span>
                )} shipped to tools other developers depend on.
              </p>
              <Link to="/projects"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold
                               text-indigo-400 hover:text-indigo-300 transition-colors group">
                See all contributions
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 section-reveal">
              {contribData.contributions.slice(0, 3).map((c, i) => (
                <a key={c.id}
                   href={c.url}
                   target="_blank" rel="noopener noreferrer"
                   className="group flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300
                              hover:-translate-y-1 bg-white/[0.02] border-white/[0.06]
                              hover:border-emerald-500/30 hover:bg-white/[0.04]"
                   style={{ transitionDelay: `${i * 80}ms` }}>

                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <a href={c.repoUrl} target="_blank" rel="noopener noreferrer"
                       className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 truncate transition-colors"
                       onClick={e => e.stopPropagation()}>
                      {c.repo}
                    </a>
                    {c.stars > 0 && (
                      <span className="ml-auto text-xs text-slate-600 flex-shrink-0">★ {c.stars}</span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-slate-200 leading-snug
                                group-hover:text-white transition-colors flex-1 line-clamp-2">
                    {c.title}
                  </p>

                  {c.body && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {plainText(c.body)}
                    </p>
                  )}

                  {(c.additions > 0 || c.deletions > 0 || c.changedFiles > 0) && (
                    <div className="flex items-center gap-2 flex-wrap py-2 px-3 rounded-lg
                                    bg-white/[0.03] border border-white/[0.04]">
                      {c.additions > 0 && (
                        <span className="text-[11px] font-mono font-semibold text-emerald-400 whitespace-nowrap">
                          +{c.additions.toLocaleString()}
                        </span>
                      )}
                      {c.deletions > 0 && (
                        <span className="text-[11px] font-mono font-semibold text-rose-400 whitespace-nowrap">
                          -{c.deletions.toLocaleString()}
                        </span>
                      )}
                      {c.changedFiles > 0 && (
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {c.changedFiles} file{c.changedFiles !== 1 ? 's' : ''}
                        </span>
                      )}
                      {c.commits > 0 && (
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {c.commits} commit{c.commits !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-auto pt-2
                                  border-t border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      {c.language && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: getLangColor(c.language) }} />
                          {c.language}
                        </span>
                      )}
                      {c.mergedAt && (
                        <span className="text-xs text-slate-500">{formatMonth(c.mergedAt)}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem]
                                     font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex-shrink-0">
                      ✓ Merged
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          4 · GITHUB ACTIVITY — full viewport, one clear metric
          Hidden when no real data (fallback empty JSON locally)
      ══════════════════════════════════════════════════════════ */}
      {(actSt === 'loading' || (actSt === 'ready' && activityData && activityData.weeks.length > 0)) && (
        <section id="sec-activity"
                 className="snap-section-full border-t border-white/[0.04]
                            flex flex-col justify-center py-20 sm:py-24"
                 aria-labelledby="activity-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            <header className="mb-10 section-reveal">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-4">
                Commit history
              </p>
              {activityData && activityData.totalContributions > 0 ? (
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <span className="text-5xl sm:text-7xl font-black tabular-nums gradient-text leading-none">
                    {activityData.totalContributions.toLocaleString()}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-400" id="activity-heading">
                    contributions this year
                  </span>
                </div>
              ) : (
                <h2 id="activity-heading"
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                  GitHub Activity
                </h2>
              )}
              <p className="text-slate-500 text-sm">
                Daily contributions across all public and private repositories.
              </p>
            </header>

            {actSt === 'loading' && (
              <div className="skeleton h-36 rounded-2xl" aria-hidden="true" />
            )}

            {actSt === 'ready' && activityData && activityData.weeks.length > 0 && (
              <div className="p-4 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]
                              section-reveal"
                   style={{ touchAction: 'pan-y' }}>
                <ContributionCalendar dataset={activityData} />
              </div>
            )}
          </div>
        </section>
      )}

    </>
  );
}
