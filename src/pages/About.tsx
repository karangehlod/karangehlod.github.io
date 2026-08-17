import { Link } from 'react-router-dom';
import { experience, skillGroups, certifications, awards } from '../data/resumeData';
import { BadgeIcon, ArrowIcon } from '../components/Icons';

export default function About() {

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden" aria-labelledby="about-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[560px] h-[560px] bg-indigo-600/20 -top-24 right-0 animate-blob" />
          <div className="hero-blob w-[400px] h-[400px] bg-sky-600/15 bottom-0 -left-16 animate-blob-slow"
               style={{ animationDelay: '-6s' }} />
          <div className="dot-grid" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-center">

            {/* Photo */}
            <div className="flex justify-center lg:justify-start animate-fade-up-1">
              <div className="relative">
                <div className="absolute inset-0 gradient-bg opacity-40 blur-3xl rounded-3xl scale-110"
                     aria-hidden="true" />
                <img src="/profile_image.png"
                     alt="Karan Gehlod — Senior AI Engineer"
                     width="288" height="288"
                     className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72
                                rounded-3xl object-cover object-top
                                ring-2 ring-indigo-500/40 shadow-2xl shadow-indigo-500/25" />
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3 animate-fade-up-1">
                Who I am
              </p>
              <h1 id="about-heading"
                  className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-up-2">
                <span className="text-slate-100">About</span><br />
                <span className="gradient-text">Me</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8 max-w-xl animate-fade-up-3">
                Senior AI Engineer specialising in production autonomous systems —
                multi-agent orchestration, RAG pipelines, and cloud-native AI platforms.
                Delivered <strong className="text-slate-200">$250K+ impact</strong> at Johnson Controls.
              </p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 animate-fade-up-4">
                {[
                  { label: 'Indore, India', icon: '📍' },
                  { label: 'karan.gehlod@gmail.com', href: 'mailto:karan.gehlod@gmail.com' },
                  { label: 'github.com/karangehlod', href: 'https://github.com/karangehlod', external: true },
                  { label: '@theprodsde', href: 'https://medium.com/@theprodsde', external: true },
                ].map(({ label, href, external }) => {
                  const cls = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                               font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300
                               hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-300
                               transition-all duration-200`;
                  if (!href) return <span key={label} className={cls}>{label}</span>;
                  return (
                    <a key={label} href={href}
                       {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                       className={cls}>
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Summary ── */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3">Summary</p>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-4xl">
              Senior AI Software Engineer specialising in production autonomous systems —
              multi-agent orchestration (<strong className="text-slate-100">A2A, LangGraph</strong>),
              real-time control architectures, and cloud-native platforms
              (<strong className="text-slate-100">AKS, Kubernetes</strong>).
              Specialises in end-to-end platform design: system boundaries, API contracts,
              and closed-loop feedback (<span className="text-slate-200">data → model → decision → control</span>).
              Delivered <strong className="text-slate-100">$250K+ impact</strong> at Johnson Controls;
              drove org-wide AI adoption from prototype to production.
            </p>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="exp-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">Career</p>
            <h2 id="exp-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight">Experience</h2>
          </header>
          <div className="space-y-6">
            {experience.map(exp => (
              <article key={exp.company}
                       className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                                  transition-all duration-300 reveal"
                       style={{ ['--hover-bg' as string]: `${exp.accentColor}0a` }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100"
                        dangerouslySetInnerHTML={{ __html: exp.title }} />
                    <p className="font-semibold mt-0.5" style={{ color: exp.accentColor }}>{exp.company}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                    <span className="text-sm text-slate-400">{exp.period}</span>
                    <span className="text-xs text-slate-600">{exp.location}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400 leading-relaxed">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: exp.accentColor }}>▸</span>
                      <span dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="skills-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">Technical</p>
            <h2 id="skills-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight">Skills</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillGroups.map(g => (
              <div key={g.label}
                   className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] reveal">
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${g.color}`}>{g.label}</p>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="edu-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">Academic</p>
            <h2 id="edu-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight">Education</h2>
          </header>
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] reveal
                          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-100">Bachelor of Engineering</h3>
              <p className="text-indigo-400 font-medium mt-0.5">Shri G S Institute of Technology and Science</p>
              <p className="text-sm text-slate-500 mt-1">Indore, India</p>
            </div>
            <span className="text-sm text-slate-400 flex-shrink-0">July 2016 – May 2020</span>
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="cert-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">Credentials</p>
            <h2 id="cert-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight">Certifications</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map(cert => (
              <a key={cert.name}
                 href={cert.url}
                 target="_blank" rel="noopener noreferrer"
                 className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                            hover:-translate-y-0.5 transition-all duration-300 reveal group">
                <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
                     style={{ background: `linear-gradient(135deg, ${cert.gradFrom}, ${cert.gradTo})` }}>
                  <BadgeIcon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {cert.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cert.issuer} · <span style={{ color: cert.gradFrom }}>View credential ↗</span>
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-16 border-t border-white/[0.04]" aria-labelledby="awards-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 reveal">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">Recognition</p>
            <h2 id="awards-heading" className="text-4xl sm:text-5xl font-extrabold tracking-tight">Awards</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {awards.map(award => (
              <div key={award.title}
                   className="flex items-start gap-5 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                              transition-all duration-300 reveal">
                <div className="w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0 shadow-lg"
                     style={{
                       background: `linear-gradient(135deg, ${award.gradFrom}, ${award.gradTo})`,
                       boxShadow: `0 8px 24px ${award.gradFrom}30`,
                     }}>
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{award.title}</h3>
                  <p className="text-sm font-medium mt-0.5" style={{ color: award.gradFrom }}>
                    {award.org} · {award.period}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{award.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            See what I've <span className="gradient-text">built</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Browse professional portfolio projects and public open-source repositories.
          </p>
          <Link to="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold
                           text-sm text-white gradient-bg shadow-lg shadow-indigo-500/30
                           hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/50
                           transition-all duration-300">
            Explore projects <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
