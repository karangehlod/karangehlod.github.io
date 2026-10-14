import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useContributions } from '../hooks/useContributions';
import { useActivity } from '../hooks/useActivity';
import { ProjectCard } from '../components/ProjectCard';
import { ContributionCalendar } from '../components/ContributionCalendar';
import { GithubIcon } from '../components/Icons';
import { useCountUp, useInView } from '../hooks/useFx';
import { getLangColor, formatMonth } from '../utils/languageColors';

/* Readout value that counts up once its data is ready */
function CountValue({ value, ready }: { value: number; ready: boolean }) {
  const n = useCountUp(value, ready);
  return <>{ready ? n.toLocaleString() : '-'}</>;
}

/* ── Section node navigation (xl desktops only) ──────────────── */
const DOTS = [
  { id: 'sec-hero',     label: 'Home'        },
  { id: 'sec-about',    label: 'About'       },
  { id: 'sec-featured', label: 'Projects'    },
  { id: 'sec-oss',      label: 'Open source' },
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
      {/* Vertical wire */}
      <div className="absolute right-[7px] inset-y-0 w-px bg-line" aria-hidden="true" />

      {DOTS.map(({ id, label }) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            aria-label={`Go to ${label}`}
            className="relative flex items-center justify-end gap-3 group outline-none py-3"
          >
            <span className={`text-[11px] font-medium whitespace-nowrap leading-none
              transition-opacity duration-200
              ${on ? 'opacity-100 text-ink' : 'opacity-0 group-hover:opacity-70 text-fnt'}`}>
              {label}
            </span>
            {/* Square node on the wire */}
            <span className={`relative z-10 flex-shrink-0 transition-all duration-200
              ${on
                ? 'w-[9px] h-[9px] bg-signal'
                : 'w-[7px] h-[7px] bg-fnt group-hover:bg-mut'}`} />
          </button>
        );
      })}
    </nav>
  );
}

/* ── Hero schematic: the closed loop, drawn once, then inspectable ── */
const LOOP_BOXES = [
  { x: 50,  y: 38,  title: 'Data',     sub: 'ingest',
    desc: 'Telemetry, documents, and events stream in from real systems.' },
  { x: 260, y: 38,  title: 'Model',    sub: 'RAG + LLM',
    desc: 'Retrieval pipelines ground language models in the right context.' },
  { x: 260, y: 258, title: 'Decision', sub: 'agents',
    desc: 'Multi-agent orchestration turns model output into executable plans.' },
  { x: 50,  y: 258, title: 'Control',  sub: 'act',
    desc: 'Actions run against live infrastructure - and feed back in as data.' },
];

function LoopSchematic() {
  const [active, setActive] = useState<string | null>(null);
  const stage = LOOP_BOXES.find(b => b.title === active);

  return (
    <div>
      <svg viewBox="0 0 420 340" className="w-full" role="img"
           aria-label="Closed-loop system diagram: data to model to decision to control, and back to data">
        {/* The loop wire - draws itself on load */}
        <path className="loop-wire loop-draw" d="M105,60 H315 V280 H105 Z" />

        {/* Signal pulse orbiting the loop (under the boxes) */}
        <circle className="loop-pulse loop-orbit" r="3.5"
                style={{ offsetPath: 'path("M105,60 H315 V280 H105 Z")' }} />

        {/* Direction arrowheads */}
        <g className="loop-fade loop-fade-3" fill="var(--faint)">
          <polygon points="205,55 215,60 205,65" />
          <polygon points="310,165 315,175 320,165" />
          <polygon points="215,275 205,280 215,285" />
          <polygon points="100,175 105,165 110,175" />
        </g>

        {/* Stage boxes - hover, tap, or focus to inspect */}
        {LOOP_BOXES.map((b, i) => (
          <g key={b.title}
             className={`loop-node loop-fade loop-fade-${i + 1} ${active === b.title ? 'on' : ''}`}
             tabIndex={0}
             role="button"
             aria-label={`${b.title}: ${b.desc}`}
             onMouseEnter={() => setActive(b.title)}
             onMouseLeave={() => setActive(a => (a === b.title ? null : a))}
             onFocus={() => setActive(b.title)}
             onBlur={() => setActive(a => (a === b.title ? null : a))}
             onClick={() => setActive(a => (a === b.title ? null : b.title))}>
            <rect className="loop-box" x={b.x} y={b.y} width="110" height="44" rx="4" />
            <text className="loop-label" x={b.x + 14} y={b.y + 20}>{b.title}</text>
            <text className="loop-sub"   x={b.x + 14} y={b.y + 34}>{b.sub}</text>
          </g>
        ))}

        {/* Center annotation */}
        <text className="loop-sub loop-fade loop-fade-4" x="210" y="172" textAnchor="middle">
          closed-loop feedback
        </text>
      </svg>

      {/* Stage inspector - reads out whichever stage is selected */}
      <p className="mt-3 min-h-[2.5rem] px-2 font-mono text-xs leading-relaxed text-fnt"
         aria-live="polite">
        {stage ? (
          <><span className="text-signal">{stage.title}:</span>{' '}
            <span className="text-mut">{stage.desc}</span></>
        ) : (
          'The loop I build every day. Inspect a stage.'
        )}
      </p>
    </div>
  );
}

/* ── Instrument readout strip ────────────────────────────────── */
function ReadoutStrip({
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
    { id: 'repos', val: projects.length,  label: 'public repos'   },
    { id: 'langs', val: langCount,         label: 'languages'      },
    { id: 'stars', val: stars,             label: 'total stars'    },
    { id: 'oss',   val: ossTotal ?? 0,     label: 'OSS PRs merged' },
  ];

  return (
    <section className="readout py-4" aria-label="Repository statistics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-y-3">
          {stats.map(({ id, val, label }, i) => (
            <div key={id} className="flex items-center">
              <div className="flex flex-col gap-0.5 px-2 sm:px-8 sm:first:pl-0">
                <dd className="readout-value"><CountValue value={val} ready={ready} /></dd>
                <dt className="readout-label">{label}</dt>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-9 bg-line self-center flex-shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
          <div className="w-px h-9 bg-line self-center flex-shrink-0 hidden sm:block" />
          <div className="flex flex-col gap-0.5 px-2 sm:px-8 col-span-2 sm:col-span-1">
            <dd className="flex items-center gap-2 readout-value">
              <span className="w-2 h-2 rounded-full bg-tel animate-pulse" aria-hidden="true" />
              live
            </dd>
            <dt className="readout-label">GitHub sync</dt>
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

/* ── Home page ──────────────────────────────────────────────── */
export default function Home() {
  const { dataset, status }                      = useProjects();
  const { dataset: contribData }                 = useContributions();
  const { dataset: activityData, status: actSt } = useActivity();

  const featuredProjects = dataset?.featuredProjects ?? [];
  const ossTotal         = contribData ? contribData.total : null;
  const [activityRef, activityInView] = useInView<HTMLElement>(0.2);
  const activityCount = useCountUp(
    activityData?.totalContributions ?? 0,
    activityInView && !!activityData,
    1400
  );
  const totalAdditions   = contribData
    ? contribData.contributions.reduce((s, c) => s + (c.additions ?? 0), 0)
    : 0;

  return (
    <>

      {/* ═══════════════════════════════════════════════════════
          1 · HERO - name as the system under control
      ══════════════════════════════════════════════════════════ */}
      <section id="sec-hero"
               className="snap-section-full relative flex flex-col justify-center overflow-hidden"
               aria-labelledby="hero-heading">
        <div className="draft-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8
                        grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 items-center
                        pt-28 pb-12 lg:pb-32">

          {/* Left: identity */}
          <div>
            <h1 id="hero-heading"
                className="display-wide text-[clamp(3rem,8.5vw,6.5rem)] text-ink mb-5 hero-name">
              Karan<br />Gehlod
            </h1>
            <p className="text-lg font-medium text-signal mb-4 hero-enter hero-enter-2">
              Senior AI engineer
            </p>
            <p className="text-[clamp(1rem,2vw,1.125rem)] text-mut leading-relaxed
                          max-w-[52ch] mb-9 hero-enter hero-enter-2">
              I build production autonomous systems: multi-agent orchestration,
              RAG pipelines, and the closed feedback loops that keep them honest.
              Research goes in, reliable software comes out.
            </p>

            <div className="flex flex-wrap gap-3 hero-enter hero-enter-3">
              <Link to="/projects" className="btn btn-primary">
                See projects
              </Link>
              <Link to="/about" className="btn btn-ghost">
                About me
              </Link>
              <a href="https://github.com/karangehlod"
                 target="_blank" rel="noopener noreferrer"
                 className="btn btn-ghost">
                <GithubIcon /> GitHub
              </a>
            </div>
          </div>

          {/* Right: the loop - visible on every screen size */}
          <div className="flex justify-center lg:justify-end hero-enter hero-enter-3">
            <div className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
              <LoopSchematic />
            </div>
          </div>
        </div>

        {/* Readout strip: in flow on mobile, pinned to hero bottom on desktop */}
        <div className="lg:absolute lg:bottom-0 lg:inset-x-0 mt-8 lg:mt-0 hero-enter hero-enter-3">
          <ReadoutStrip dataset={dataset} ossTotal={ossTotal} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2 · WHO I AM - photo left, identity right
      ══════════════════════════════════════════════════════════ */}
      <section id="sec-about"
               className="snap-section-full overflow-hidden"
               aria-labelledby="about-heading">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* Left: full-height photo */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-r
                            from-transparent to-ground" aria-hidden="true" />
            <img src="/profile_image.png"
                 alt="Karan Gehlod"
                 className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>

          {/* Right: identity */}
          <div className="flex flex-col justify-center gap-6
                          px-8 sm:px-12 lg:px-16 py-24 lg:py-0">

            {/* mobile: small photo */}
            <div className="lg:hidden flex justify-start mb-2">
              <img src="/profile_image.png" alt="Karan Gehlod"
                   className="w-24 h-24 rounded-md object-cover object-top border border-line-strong" />
            </div>

            <div className="node-rule fx-rule"><span>Who I am</span></div>

            <div>
              <h2 id="about-heading"
                  className="display-wide text-5xl sm:text-6xl text-ink mb-3 fx-head">
                AI that runs real buildings
              </h2>
              <p className="text-signal font-medium text-lg fx-rise"
                 style={{ '--fxd': '150ms' } as React.CSSProperties}>
                Karan Gehlod - Senior AI engineer, Johnson Controls
              </p>
            </div>

            <p className="text-mut text-lg leading-relaxed max-w-[52ch] fx-rise"
               style={{ '--fxd': '250ms' } as React.CSSProperties}>
              I design the AI layer for smart-building platforms - multi-agent
              orchestration, RAG pipelines, and cloud-native architecture with
              feedback loops closing over real infrastructure. My cloud work delivered
              <strong className="text-ink font-semibold"> $150K in realised AKS savings</strong>;
              SmartRCA automation impact is estimated separately at $150K per year.
            </p>

            {/* Facts row - machine values in mono */}
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-4 fx-rise"
                style={{ '--fxd': '350ms' } as React.CSSProperties}>
              {[
                { val: '$150K', label: 'realised AKS savings' },
                { val: '5+',    label: 'years of experience' },
                { val: '3',     label: 'A2A business units' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <dd className="font-mono text-xl font-semibold text-ink tabular-nums">{val}</dd>
                  <dt className="text-xs text-fnt">{label}</dt>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="btn btn-primary">
                More about me
              </Link>
              <Link to="/projects" className="btn btn-ghost">
                See projects
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
                 className="snap-section py-24 sm:py-28"
                 aria-labelledby="featured-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            <div className="node-rule fx-rule mb-8"><span>Featured projects</span></div>
            <header className="mb-12">
              <h2 id="featured-heading" className="display text-4xl sm:text-5xl text-ink mb-4 fx-head">
                Repos I'm most proud of
              </h2>
              <p className="text-mut text-lg max-w-[52ch] leading-relaxed fx-rise"
                 style={{ '--fxd': '150ms' } as React.CSSProperties}>
                Each one solves a real problem in production AI - benchmarks,
                protocols, and pipelines, not toys.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
              {status === 'loading'
                ? <Skeletons count={3} tall />
                : featuredProjects.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))
              }
            </div>

            <Link to="/projects" className="btn btn-ghost">
              See all repositories
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          4 · OSS CONTRIBUTIONS
      ══════════════════════════════════════════════════════════ */}
      {contribData && contribData.contributions.length > 0 && (
        <section id="sec-oss"
                 className="snap-section py-24 sm:py-28 border-t border-line"
                 aria-labelledby="oss-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            <div className="node-rule fx-rule mb-8"><span>Open source</span></div>
            <header className="mb-12">
              <h2 id="oss-heading" className="display text-4xl sm:text-5xl text-ink mb-4 fx-head">
                Contributing to the ecosystem
              </h2>
              <p className="text-mut text-lg max-w-[56ch] leading-relaxed fx-rise"
                 style={{ '--fxd': '150ms' } as React.CSSProperties}>
                Merged pull requests to external projects{totalAdditions > 0 && (
                  <> - <span className="font-mono text-tel">+{totalAdditions.toLocaleString()}</span> lines</>
                )} shipped to tools other developers depend on.
              </p>
              <Link to="/projects" className="tlink inline-block mt-4 text-sm font-semibold">
                See all contributions
              </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contribData.contributions.slice(0, 3).map((c, i) => (
                <a key={c.id}
                   href={c.url}
                   target="_blank" rel="noopener noreferrer"
                   className="panel panel-hover group flex flex-col gap-3 p-5 fx-rise"
                   style={{ '--fxd': `${i * 90}ms` } as React.CSSProperties}>

                  <div className="flex items-center gap-2 min-w-0">
                    <GithubIcon className="w-3.5 h-3.5 flex-shrink-0 text-fnt" />
                    <span className="text-xs font-semibold text-mut truncate">{c.repo}</span>
                    {c.stars > 0 && (
                      <span className="ml-auto text-xs font-mono text-fnt flex-shrink-0">★ {c.stars}</span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-ink leading-snug flex-1 line-clamp-2
                                group-hover:text-signal transition-colors">
                    {c.title}
                  </p>

                  {c.body && (
                    <p className="text-xs text-fnt leading-relaxed line-clamp-2">
                      {plainText(c.body)}
                    </p>
                  )}

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

                  <div className="flex items-center justify-between gap-2 mt-auto pt-2
                                  border-t border-line">
                    <div className="flex items-center gap-3 text-xs text-fnt">
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
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          5 · GITHUB ACTIVITY
          Hidden when no real data (fallback empty JSON locally)
      ══════════════════════════════════════════════════════════ */}
      {(actSt === 'loading' || (actSt === 'ready' && activityData && activityData.weeks.length > 0)) && (
        <section id="sec-activity"
                 className="snap-section py-24 sm:py-28 border-t border-line"
                 aria-labelledby="activity-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

            <div className="node-rule fx-rule mb-8"><span>Commit activity</span></div>
            <header className="mb-10" ref={activityRef}>
              {activityData && activityData.totalContributions > 0 ? (
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <span className="font-mono text-5xl sm:text-6xl font-semibold text-ink tabular-nums leading-none">
                    {activityCount.toLocaleString()}
                  </span>
                  <span className="display text-xl sm:text-2xl text-mut" id="activity-heading">
                    contributions this year
                  </span>
                </div>
              ) : (
                <h2 id="activity-heading" className="display text-4xl sm:text-5xl text-ink mb-2">
                  GitHub activity
                </h2>
              )}
              <p className="text-fnt text-sm">
                Daily contributions across all public and private repositories.
              </p>
            </header>

            {actSt === 'loading' && (
              <div className="skeleton h-36" aria-hidden="true" />
            )}

            {actSt === 'ready' && activityData && activityData.weeks.length > 0 && (
              <div className="panel p-4 sm:p-6 cal-sweep" style={{ touchAction: 'pan-y' }}>
                <ContributionCalendar dataset={activityData} />
              </div>
            )}
          </div>
        </section>
      )}

    </>
  );
}
