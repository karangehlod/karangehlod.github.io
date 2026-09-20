import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GithubIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { SearchModal } from './SearchModal';
import { useProjects } from '../hooks/useProjects';

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/about',        label: 'About'        },
  { to: '/projects',     label: 'Projects'     },
  { to: '/publications', label: 'Publications' },
] as const;

/* Mark: a terminal prompt — mono "kg" with a live cursor block */
function LogoMark() {
  return (
    <span className="font-mono text-xl font-semibold text-ink leading-none select-none
                     inline-flex items-baseline"
          aria-hidden="true">
      kg<span className="logo-cursor" />
    </span>
  );
}

/* Thin signal trace along the top edge showing scroll progress */
function ScrollTrace() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 h-[2px] bg-signal z-[60]"
         style={{ width: `${progress * 100}%` }}
         aria-hidden="true" />
  );
}

export function Nav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { dataset } = useProjects();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <ScrollTrace />
      <nav
        aria-label="Site navigation"
        className={`fixed inset-x-0 top-0 z-50 h-16 flex items-center border-b border-transparent
                    transition-colors duration-300 ${scrolled || menuOpen ? 'nav-scrolled' : ''}`}
      >
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Home"
                onClick={() => setMenuOpen(false)}>
            <LogoMark />
            <span className="text-sm font-semibold text-ink hidden sm:block">
              Karan Gehlod
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`px-3.5 py-2 text-sm font-medium border-b-2 transition-colors duration-150
                    ${pathname === to
                      ? 'text-ink border-signal'
                      : 'text-mut border-transparent hover:text-ink'}`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Search */}
            <li>
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                           text-mut hover:text-ink transition-colors"
                aria-label="Search (Ctrl+K)"
              >
                <SearchIcon />
                <span className="hidden lg:inline text-xs">Search</span>
                <kbd className="hidden lg:inline px-1 py-0.5 text-[0.6rem] rounded font-mono
                               border border-line text-fnt">⌘K</kbd>
              </button>
            </li>

            {/* Theme toggle */}
            <li>
              <button
                onClick={toggle}
                className="p-2 text-mut hover:text-ink transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </li>

            <li>
              <a
                href="https://github.com/karangehlod"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost !px-3.5 !py-2 text-sm ml-2"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            </li>
          </ul>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={toggle}
              className="p-2 text-mut hover:text-ink transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 text-mut hover:text-ink transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={`fixed inset-x-0 top-16 z-40 md:hidden bg-ground border-b border-line
                    transition-opacity duration-200 overflow-hidden
                    ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ maxHeight: menuOpen ? 'calc(100vh - 4rem)' : '0' }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-1 p-4 pb-8">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3.5 rounded-md text-base font-medium border-l-2 transition-colors
                ${pathname === to
                  ? 'text-ink border-signal bg-panel'
                  : 'text-mut border-transparent hover:text-ink hover:bg-panel'}`}
            >
              {label}
            </Link>
          ))}

          <div className="my-2 border-t border-line" />

          {/* Search button */}
          <button
            onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-md text-base font-medium
                       text-mut hover:text-ink hover:bg-panel transition-colors"
          >
            <SearchIcon /> Search repos
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/karangehlod"
            target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-md text-base font-medium
                       text-mut hover:text-ink hover:bg-panel transition-colors"
          >
            <GithubIcon className="w-4 h-4" /> GitHub
          </a>
        </nav>
      </div>

      {/* Backdrop overlay (closes menu on tap outside) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ top: '4rem' }}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        githubProjects={dataset?.projects ?? []}
      />
    </>
  );
}
