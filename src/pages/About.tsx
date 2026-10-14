import { Link } from 'react-router-dom';
import { experience, skillGroups, certifications, awards, professionalSummary, leadershipSummary } from '../data/resumeData';
import { BadgeIcon } from '../components/Icons';

export default function About() {

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 overflow-hidden" aria-labelledby="about-heading">
        <div className="draft-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-20 items-center">

            {/* Photo - squared, drafting-frame corners */}
            <div className="flex justify-start">
              <img src="/profile_image.png"
                   alt="Karan Gehlod, Senior AI Engineer"
                   width="288" height="288"
                   className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-md
                              object-cover object-top border border-line-strong" />
            </div>

            {/* Text */}
            <div>
              <div className="node-rule fx-rule mb-8"><span>About</span></div>
              <h1 id="about-heading"
                  className="display-wide text-5xl sm:text-7xl text-ink mb-6 fx-head">
                Karan Gehlod
              </h1>
              <p className="text-lg sm:text-xl text-mut leading-relaxed mb-8 max-w-[52ch] fx-rise" style={{ '--fxd': '150ms' } as React.CSSProperties}>
                Senior AI engineer specialising in production autonomous systems -
                multi-agent orchestration, RAG pipelines, and cloud-native AI
                platforms. Delivered <strong className="text-ink font-semibold">$150K
                in realised AKS savings</strong> at Johnson Controls, with automation
                impact estimated separately.
              </p>

              {/* Contact facts */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Bengaluru, India' },
                  { label: 'karan.gehlod@gmail.com', href: 'mailto:karan.gehlod@gmail.com' },
                  { label: 'github.com/karangehlod', href: 'https://github.com/karangehlod', external: true },
                  { label: 'medium.com/@theprodsde', href: 'https://medium.com/@theprodsde', external: true },
                ].map(({ label, href, external }) => {
                  if (!href) return <span key={label} className="chip">{label}</span>;
                  return (
                    <a key={label} href={href}
                       {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                       className="chip hover:text-signal hover:border-line-strong transition-colors">
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Summary</span></div>
          <p className="text-lg sm:text-xl text-mut leading-relaxed max-w-[62ch] fx-rise">
            {professionalSummary} {leadershipSummary}
          </p>
        </div>
      </section>

      {/* ── Experience - a real sequence, drawn as a timeline wire ── */}
      <section className="py-16" aria-labelledby="exp-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Career</span></div>
          <header className="mb-12">
            <h2 id="exp-heading" className="display text-4xl sm:text-5xl text-ink fx-head">Experience</h2>
          </header>

          <div className="relative border-l border-line-strong ml-1 pl-8 sm:pl-10 space-y-12">
            {experience.map(exp => (
              <article key={exp.company} className="relative fx-rise">
                {/* Node on the wire */}
                <span className="absolute -left-8 sm:-left-10 top-2 -translate-x-1/2
                                 w-2.5 h-2.5 bg-signal" aria-hidden="true" />

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{exp.title}</h3>
                    <p className="font-medium text-signal mt-0.5">{exp.company}</p>
                    {exp.rolePeriod && <p className="text-sm text-mut mt-1">Current role: {exp.rolePeriod}</p>}
                    {exp.previousRole && <p className="text-sm text-fnt mt-1">Previously: {exp.previousRole}</p>}
                  </div>
                  <div className="flex flex-col sm:items-end gap-0.5 flex-shrink-0">
                    <span className="text-sm font-mono text-mut">{exp.period}</span>
                    <span className="text-xs text-fnt">{exp.location}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-mut leading-relaxed max-w-[75ch]">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 w-1 h-1 flex-shrink-0 bg-fnt" aria-hidden="true" />
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
      <section className="py-16" aria-labelledby="skills-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Technical</span></div>
          <header className="mb-12">
            <h2 id="skills-heading" className="display text-4xl sm:text-5xl text-ink fx-head">Skills</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillGroups.map((g, i) => (
              <div key={g.label} className="panel p-5 fx-rise"
                   style={{ '--fxd': `${i * 70}ms` } as React.CSSProperties}>
                <p className="text-sm font-semibold text-ink mb-4">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.skills.map(s => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="py-16" aria-labelledby="edu-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Academic</span></div>
          <header className="mb-10">
            <h2 id="edu-heading" className="display text-4xl sm:text-5xl text-ink fx-head">Education</h2>
          </header>
          <div className="panel p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">Bachelor of Engineering</h3>
              <p className="text-mut font-medium mt-0.5">Shri G S Institute of Technology and Science</p>
              <p className="text-sm text-fnt mt-1">Indore, India</p>
            </div>
            <span className="text-sm font-mono text-mut flex-shrink-0">July 2016 – May 2020</span>
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="py-16" aria-labelledby="cert-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Credentials</span></div>
          <header className="mb-10">
            <h2 id="cert-heading" className="display text-4xl sm:text-5xl text-ink fx-head">Certifications</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <a key={cert.name}
                 href={cert.url}
                 target="_blank" rel="noopener noreferrer"
                 className="panel panel-hover group flex items-start gap-4 p-5 fx-rise"
                 style={{ '--fxd': `${i * 70}ms` } as React.CSSProperties}>
                <div className="w-10 h-10 rounded-md border border-line grid place-items-center
                                flex-shrink-0 text-signal">
                  <BadgeIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink group-hover:text-signal transition-colors">
                    {cert.name}
                  </p>
                  <p className="text-xs text-fnt mt-0.5">{cert.issuer}</p>
                  <span className="tlink inline-block text-xs mt-2">View credential</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards ── */}
      <section className="py-16" aria-labelledby="awards-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Recognition</span></div>
          <header className="mb-10">
            <h2 id="awards-heading" className="display text-4xl sm:text-5xl text-ink fx-head">Awards</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {awards.map((award, i) => (
              <div key={award.title} className="panel panel-featured p-6 fx-rise"
                   style={{ '--fxd': `${i * 70}ms` } as React.CSSProperties}>
                <h3 className="text-base font-semibold text-ink">{award.title}</h3>
                <p className="text-sm font-medium text-mut mt-0.5">
                  {award.org} <span className="font-mono text-fnt">{award.period}</span>
                </p>
                <p className="text-sm text-fnt mt-2 leading-relaxed">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Next</span></div>
          <h2 className="display text-4xl sm:text-5xl text-ink mb-6 fx-head">
            See what I've built
          </h2>
          <p className="text-mut text-lg mb-10 leading-relaxed max-w-[52ch]">
            Professional portfolio projects and public open-source repositories,
            sourced live from GitHub.
          </p>
          <Link to="/projects" className="btn btn-primary">
            See projects
          </Link>
        </div>
      </section>
    </>
  );
}
