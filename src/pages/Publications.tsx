import { usePublications } from '../hooks/usePublications';
import { useContent }      from '../hooks/useContent';
import { ExternalIcon }    from '../components/Icons';

export default function Publications() {
  const { publications, status } = usePublications();
  const { content } = useContent();
  const orcid = content?.social?.orcid;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-12 overflow-hidden" aria-labelledby="pub-heading">
        <div className="draft-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="node-rule fx-rule mb-8"><span>Research</span></div>
          <h1 id="pub-heading" className="display-wide text-5xl sm:text-7xl text-ink mb-6 fx-head">
            Publications
          </h1>
          <p className="text-lg text-mut leading-relaxed max-w-[52ch] mb-6 fx-rise" style={{ '--fxd': '150ms' } as React.CSSProperties}>
            Academic and technical publications, sourced live from ORCID at each
            deployment.
          </p>

          {orcid && (
            <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noopener noreferrer"
               className="chip hover:text-signal hover:border-line-strong transition-colors text-sm !px-3 !py-1.5">
              <svg className="w-4 h-4 text-tel" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.972-2.484 3.972-3.722 0-2.016-1.284-3.722-4.094-3.722h-2.175z"/>
              </svg>
              ORCID <span className="font-mono">{orcid}</span>
            </a>
          )}
        </div>
      </section>

      {/* Publications list */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {status === 'loading' && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-24" aria-hidden="true"/>
              ))}
            </div>
          )}

          {status === 'none' && !orcid && (
            <div className="panel border-dashed p-12">
              <p className="text-ink font-semibold mb-2">No ORCID configured</p>
              <p className="text-sm text-mut">
                Add your ORCID iD to <code className="font-mono text-signal">content/profile.md</code> under{' '}
                <code className="font-mono text-signal">social.orcid</code> to list publications here.
              </p>
            </div>
          )}

          {status === 'none' && orcid && (
            <div className="panel border-dashed p-12">
              <p className="text-ink font-semibold mb-2">Nothing published yet</p>
              <p className="text-sm text-mut">
                No public works found on ORCID for this profile. New works appear
                automatically at the next deployment.
              </p>
            </div>
          )}

          {status === 'ready' && (
            <div className="space-y-4">
              {publications.map((pub, i) => (
                <article key={pub.orcidWorkId ?? i} className="panel panel-hover p-5 fx-rise"
                         style={{ '--fxd': `${Math.min(i, 6) * 80}ms` } as React.CSSProperties}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-ink leading-snug mb-2">
                        {pub.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-fnt">
                        {pub.journal && (
                          <span className="font-medium text-mut">{pub.journal}</span>
                        )}
                        {pub.year && <span className="font-mono">{pub.year}</span>}
                        {pub.type && (
                          <span className="chip">{pub.type.replace(/_/g, ' ')}</span>
                        )}
                        {pub.doi && (
                          <span className="font-mono truncate max-w-[180px] sm:max-w-xs"
                                title={`DOI: ${pub.doi}`}>
                            DOI: {pub.doi}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                       className="tlink flex items-center gap-1.5 text-xs font-semibold flex-shrink-0">
                      View <ExternalIcon className="w-3 h-3" />
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
