import { usePublications } from '../hooks/usePublications';
import { useContent }      from '../hooks/useContent';

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function Publications() {
  const { publications, status } = usePublications();
  const { content } = useContent();
  const orcid = content?.social?.orcid;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-10 overflow-hidden" aria-labelledby="pub-heading">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[500px] h-[500px] bg-indigo-600/20 -top-24 right-0 animate-blob"/>
          <div className="hero-blob w-[400px] h-[400px] bg-sky-600/15 bottom-0 -left-16 animate-blob-slow"
               style={{ animationDelay: '-4s' }}/>
          <div className="dot-grid"/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-3 animate-fade-up-1">
            Research
          </p>
          <h1 id="pub-heading"
              className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-up-2">
            <span className="text-slate-100">Publications</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mb-6 animate-fade-up-3"
             style={{ color: 'var(--c-text2)' }}>
            Academic and technical publications. Sourced live from ORCID at each deployment.
          </p>

          {orcid && (
            <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border
                          hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-200
                          animate-fade-up-4"
               style={{ color: 'var(--c-text2)', borderColor: 'var(--c-border)' }}>
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.972-2.484 3.972-3.722 0-2.016-1.284-3.722-4.094-3.722h-2.175z"/>
              </svg>
              ORCID: {orcid}
            </a>
          )}
        </div>
      </section>

      {/* Publications list */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {status === 'loading' && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-24 rounded-2xl" aria-hidden="true"/>
              ))}
            </div>
          )}

          {status === 'none' && !orcid && (
            <div className="text-center py-20 border border-dashed rounded-2xl"
                 style={{ borderColor: 'var(--c-border)' }}>
              <p className="text-4xl mb-4 opacity-40" aria-hidden="true">📄</p>
              <p className="text-sm mb-3" style={{ color: 'var(--c-text3)' }}>
                No ORCID configured.
              </p>
              <p className="text-xs" style={{ color: 'var(--c-text3)' }}>
                Add your ORCID iD to <code className="font-mono text-indigo-400">content/profile.md</code> under <code className="font-mono text-indigo-400">social.orcid</code>.
              </p>
            </div>
          )}

          {status === 'none' && orcid && (
            <div className="text-center py-20 border border-dashed rounded-2xl"
                 style={{ borderColor: 'var(--c-border)' }}>
              <p className="text-4xl mb-4 opacity-40" aria-hidden="true">📭</p>
              <p className="text-sm" style={{ color: 'var(--c-text3)' }}>
                No public works found on ORCID for this profile yet.
              </p>
            </div>
          )}

          {status === 'ready' && (
            <div className="space-y-4">
              {publications.map((pub, i) => (
                <article key={pub.orcidWorkId ?? i}
                         className="p-5 rounded-2xl border transition-all duration-300
                                    hover:-translate-y-0.5"
                         style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold leading-snug mb-2"
                          style={{ color: 'var(--c-text1)' }}>
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs"
                           style={{ color: 'var(--c-text3)' }}>
                        {pub.journal && (
                          <span className="font-medium" style={{ color: 'var(--c-text2)' }}>
                            {pub.journal}
                          </span>
                        )}
                        {pub.year && <span>{pub.year}</span>}
                        {pub.type && (
                          <span className="px-2 py-0.5 rounded-full border text-[0.65rem] font-semibold
                                           border-indigo-500/20 bg-indigo-500/[0.06] text-indigo-400">
                            {pub.type.replace(/_/g, ' ')}
                          </span>
                        )}
                        {pub.doi && (
                          <span className="font-mono truncate max-w-[180px] sm:max-w-xs"
                                title={`DOI: ${pub.doi}`}
                                style={{ color: 'var(--c-text3)' }}>
                            DOI: {pub.doi}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                                  border hover:bg-indigo-500/10 hover:border-indigo-500/40
                                  hover:text-indigo-300 transition-all duration-200 flex-shrink-0"
                       style={{ color: 'var(--c-text2)', borderColor: 'var(--c-border)' }}>
                      View <ExternalIcon />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
