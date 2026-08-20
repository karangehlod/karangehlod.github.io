import { Link } from 'react-router-dom';
import { useContent, type Social, type Support } from '../hooks/useContent';

/* ── Social icon map ─────────────────────────────────────────── */
const icons = {
  github: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  medium: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  ),
  reddit: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path fill="#fff" d="M15.7 12.65c0-.4-.32-.72-.72-.72-.2 0-.38.08-.51.2-.5-.35-1.2-.58-1.97-.61l.33-1.56 1.08.23c0 .36.29.65.65.65s.65-.29.65-.65-.29-.65-.65-.65c-.27 0-.5.16-.6.39l-1.21-.26c-.06-.02-.12.02-.14.08l-.37 1.74c-.78.03-1.49.26-2 .61-.13-.12-.31-.2-.51-.2-.4 0-.72.32-.72.72 0 .27.15.5.38.63-.04.14-.05.29-.05.44 0 1.3 1.51 2.35 3.38 2.35s3.38-1.05 3.38-2.35c0-.15-.02-.3-.05-.44.23-.13.38-.36.38-.63zm-5.43.5c0-.36.29-.65.65-.65s.65.29.65.65-.29.65-.65.65-.65-.29-.65-.65zm3.66 1.72c-.42.42-1.05.62-1.93.62s-1.51-.2-1.93-.62a.16.16 0 010-.23.16.16 0 01.23 0c.33.33.85.49 1.7.49s1.37-.16 1.7-.49a.16.16 0 01.23 0 .16.16 0 010 .23zm-.1-1.07c-.36 0-.65-.29-.65-.65s.29-.65.65-.65.65.29.65.65-.29.65-.65.65z"/>
    </svg>
  ),
  orcid: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.972-2.484 3.972-3.722 0-2.016-1.284-3.722-4.094-3.722h-2.175z"/>
    </svg>
  ),
};

function SocialLinks({ social }: { social: Social | undefined }) {
  if (!social) return null;

  const links = [
    { key: 'github',   href: `https://github.com/${social.github}`,           label: 'GitHub' },
    { key: 'linkedin', href: `https://linkedin.com/in/${social.linkedin}`,     label: 'LinkedIn' },
    { key: 'twitter',  href: `https://x.com/${social.twitter}`,                label: 'X / Twitter' },
    { key: 'medium',   href: `https://medium.com/@${social.medium}`,           label: 'Medium' },
    { key: 'reddit',   href: `https://reddit.com/user/${social.reddit}`,       label: 'Reddit' },
    ...(social.orcid ? [{ key: 'orcid', href: `https://orcid.org/${social.orcid}`, label: 'ORCID' }] : []),
  ].filter(l => l.href.split('/').pop() !== '' && l.href.split('/').pop() !== 'undefined');

  return (
    <div className="flex items-center gap-2">
      {links.map(({ key, href, label }) => (
        <a key={key}
           href={href}
           target="_blank" rel="noopener noreferrer"
           aria-label={label}
           title={label}
           className="p-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
           style={{ color: 'var(--c-text3)' }}
           onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#6366f1'}
           onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--c-text3)'}
        >
          {icons[key as keyof typeof icons]}
        </a>
      ))}
    </div>
  );
}

/* ── Support / Connect band ──────────────────────────────────── */
function SupportCards({ support }: { support: Support | undefined }) {
  if (!support) return null;

  return (
    <div className="border-t" style={{ background: 'var(--c-surf)', borderColor: 'var(--c-border-xs)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Heading row */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.14em] uppercase mb-2"
             style={{ color: '#6366f1' }}>
            Connect
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: 'var(--c-text1)' }}>
            Let's work together
          </h2>
          <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: 'var(--c-text3)' }}>
            Available for consulting, collaboration, and open-source support.
          </p>
        </div>

        {/* Cards — centered, max-w-2xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

          {/* Schedule a call */}
          <a href={`https://cal.com/${support.cal}`}
             target="_blank" rel="noopener noreferrer"
             className="group flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
             style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
             onMouseEnter={e => {
               const el = e.currentTarget as HTMLElement;
               el.style.borderColor = 'rgba(99,102,241,0.45)';
               el.style.boxShadow   = '0 8px 28px rgba(99,102,241,0.14)';
               el.style.background  = 'rgba(99,102,241,0.06)';
             }}
             onMouseLeave={e => {
               const el = e.currentTarget as HTMLElement;
               el.style.borderColor = 'var(--c-border)';
               el.style.boxShadow   = '';
               el.style.background  = 'var(--c-card)';
             }}>
            <div className="w-12 h-12 rounded-2xl gradient-bg grid place-items-center flex-shrink-0
                            shadow-lg group-hover:scale-110 transition-transform duration-300"
                 style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.30)' }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-0.5 group-hover:text-indigo-500 transition-colors"
                 style={{ color: 'var(--c-text1)' }}>
                Schedule a Call
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--c-text3)' }}>
                30-min intro · consulting · collaboration
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400">
                Book on cal.com ↗
              </span>
            </div>
          </a>

          {/* Buy me a coffee */}
          <a href={`https://paypal.me/${support.paypal}`}
             target="_blank" rel="noopener noreferrer"
             className="group flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
             style={{ background: 'var(--c-card)', borderColor: 'var(--c-border)' }}
             onMouseEnter={e => {
               const el = e.currentTarget as HTMLElement;
               el.style.borderColor = 'rgba(251,191,36,0.45)';
               el.style.boxShadow   = '0 8px 28px rgba(251,191,36,0.12)';
               el.style.background  = 'rgba(251,146,36,0.05)';
             }}
             onMouseLeave={e => {
               const el = e.currentTarget as HTMLElement;
               el.style.borderColor = 'var(--c-border)';
               el.style.boxShadow   = '';
               el.style.background  = 'var(--c-card)';
             }}>
            <div className="w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0
                            group-hover:scale-110 transition-transform duration-300"
                 style={{
                   background: 'linear-gradient(135deg,#fbbf24,#f97316)',
                   boxShadow: '0 4px 16px rgba(251,191,36,0.30)',
                 }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-0.5 group-hover:text-amber-500 transition-colors"
                 style={{ color: 'var(--c-text1)' }}>
                Buy Me a Coffee
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--c-text3)' }}>
                Support open-source work via PayPal
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                Support via PayPal ↗
              </span>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */
export function Footer() {
  const { content } = useContent();

  return (
    <footer role="contentinfo">
      <SupportCards support={content?.support} />

      <div className="border-t py-10" style={{ background: 'var(--c-surf)', borderColor: 'var(--c-border-xs)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div className="flex items-start gap-4">
              <span className="gradient-bg w-9 h-9 rounded-[10px] grid place-items-center
                               text-[0.7rem] font-black text-white tracking-wide flex-shrink-0 mt-0.5"
                    aria-hidden="true">KG</span>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--c-text1)' }}>
                  {content?.personal.name ?? 'Karan Gehlod'}
                </p>
                <p className="text-xs leading-relaxed max-w-sm" style={{ color: 'var(--c-text3)' }}>
                  {content?.personal.title ?? 'Senior AI Engineer'} · Built with Vite + React.
                  Projects sourced live from GitHub API at each deployment.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-start sm:items-end">
              <SocialLinks social={content?.social} />
              <nav className="flex flex-wrap gap-4" aria-label="Footer links">
                {[
                  { to: '/',         label: 'Home',     is: 'link' },
                  { to: '/about',    label: 'About',    is: 'link' },
                  { to: '/projects', label: 'Projects', is: 'link' },
                  { to: '/publications', label: 'Publications', is: 'link' },
                  { href: `https://github.com/karangehlod/karangehlod.github.io`, label: 'Source', is: 'a' },
                ].map(item => item.is === 'link' ? (
                  <Link key={item.to} to={item.to!}
                        className="text-xs hover:text-indigo-400 transition-colors"
                        style={{ color: 'var(--c-text3)' }}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer"
                     className="text-xs hover:text-indigo-400 transition-colors"
                     style={{ color: 'var(--c-text3)' }}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
