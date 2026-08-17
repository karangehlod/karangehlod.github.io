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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { dataset } = useProjects();

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

  const navLink = (to: string, label: string) => (
    <li key={to}>
      <Link
        to={to}
        className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors
          ${pathname === to
            ? 'text-indigo-500 border border-indigo-500/30'
            : 'hover:bg-black/[0.04] hover:text-indigo-500'}`}
        style={pathname === to
          ? { background: 'rgba(99,102,241,0.09)', color: '#6366f1' }
          : { color: 'var(--c-text2)' }}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <nav
        aria-label="Site navigation"
        className={`fixed inset-x-0 top-0 z-50 h-16 flex items-center border-b border-transparent
                    transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5" aria-label="Home">
            <span className="gradient-bg w-9 h-9 rounded-[10px] grid place-items-center
                             text-[0.7rem] font-black text-white tracking-wide flex-shrink-0"
                  aria-hidden="true">KG</span>
            <span className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--c-text1)' }}>
              Karan Gehlod
            </span>
          </Link>

          <ul className="flex items-center gap-1" role="list">
            {navLink('/about', 'About')}
            {navLink('/projects', 'Projects')}
            {navLink('/publications', 'Publications')}

            {/* Search */}
            <li>
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                           text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
                aria-label="Search (Ctrl+K)"
                title="Search (Ctrl+K)"
              >
                <SearchIcon />
                <span className="hidden lg:inline text-xs">Search</span>
                <kbd className="hidden lg:inline px-1 py-0.5 text-[0.6rem] rounded
                               bg-white/[0.05] text-slate-500 border border-white/[0.08]">⌘K</kbd>
              </button>
            </li>

            {/* Theme toggle */}
            <li>
              <button
                onClick={toggle}
                className="p-2 rounded-full text-slate-400 hover:text-slate-100
                           hover:bg-white/5 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </li>

            <li>
              <a
                href="https://github.com/karangehlod"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
                           text-slate-100 border border-indigo-500/20
                           hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300
                           transition-all duration-200"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            </li>
          </ul>

        </div>
      </nav>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        githubProjects={dataset?.projects ?? []}
      />
    </>
  );
}
