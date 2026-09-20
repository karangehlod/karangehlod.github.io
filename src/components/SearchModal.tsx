import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GitHubProject } from '../types';
import { portfolioProjects } from '../data/portfolioProjects';
import { XIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  githubProjects: GitHubProject[];
}

interface Result {
  type: 'github' | 'portfolio' | 'page';
  title: string;
  subtitle: string;
  tag?: string;
  href?: string;
  to?: string;
}

const PAGES: Result[] = [
  { type: 'page', title: 'Home',         subtitle: 'Hero, featured projects, about teaser', to: '/' },
  { type: 'page', title: 'About',        subtitle: 'Bio, experience, skills, certifications', to: '/about' },
  { type: 'page', title: 'Projects',     subtitle: 'Portfolio & GitHub repositories', to: '/projects' },
  { type: 'page', title: 'Publications', subtitle: 'Academic & technical publications', to: '/publications' },
];

export function SearchModal({ open, onClose, githubProjects }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase().trim();

  const results: Result[] = q.length < 1 ? PAGES : [
    ...githubProjects
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        p.topics.some(t => t.toLowerCase().includes(q)) ||
        (p.language ?? '').toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(p => ({
        type: 'github' as const,
        title: p.name,
        subtitle: p.description || p.language || 'GitHub repository',
        tag: p.language || undefined,
        href: p.url,
        to: '/projects',
      })),
    ...portfolioProjects
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.company.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map(p => ({
        type: 'portfolio' as const,
        title: p.title,
        subtitle: `${p.company}, ${p.period}`,
        tag: p.tags[0],
        to: '/projects',
      })),
    ...PAGES.filter(p =>
      p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)
    ),
  ];

  const handleResult = (r: Result) => {
    onClose();
    if (r.href) {
      window.open(r.href, '_blank', 'noopener noreferrer');
    } else if (r.to) {
      navigate(r.to);
    }
  };

  const TYPE_LABEL: Record<Result['type'], string> = {
    github:    'GitHub',
    portfolio: 'Portfolio',
    page:      'Page',
  };

  return (
    /* Backdrop — full-screen on mobile (no centering padding), centered on sm+ */
    <div
      className="fixed inset-0 z-[300] flex flex-col sm:flex-none sm:flex sm:items-start
                 sm:justify-center sm:pt-[10vh] sm:px-4 bg-black/60"
      onClick={onClose}
    >
      {/* Modal — full-width sheet anchored to top on mobile, panel on sm+ */}
      <div
        className="w-full sm:max-w-xl bg-panel overflow-hidden
                   rounded-b-lg sm:rounded-lg
                   border-b border-x sm:border border-line-strong animate-page-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-line">
          <svg className="w-4 h-4 text-fnt flex-shrink-0" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, skills, sections…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-ink placeholder:text-fnt"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-fnt hover:text-ink transition-colors"
            aria-label="Close search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Results — larger max-height on mobile to account for keyboard */}
        <div className="max-h-[50vh] sm:max-h-80 overflow-y-auto overscroll-contain">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-fnt">
              No results for "<span className="text-mut">{query}</span>"
            </p>
          ) : (
            <ul>
              {q.length < 1 && (
                <li className="px-4 pt-3 pb-1">
                  <span className="text-xs font-medium text-fnt">
                    Quick navigation
                  </span>
                </li>
              )}
              {results.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleResult(r)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left
                               hover:bg-panel-hi transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-ink">
                        {r.title}
                      </p>
                      <p className="text-xs truncate mt-0.5 text-fnt">
                        {r.subtitle}
                      </p>
                    </div>
                    <span className="chip flex-shrink-0">
                      {r.tag ?? TYPE_LABEL[r.type]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-line">
          <p className="text-xs text-fnt">
            <kbd className="px-1.5 py-0.5 rounded border border-line font-mono">↵</kbd> select
            <kbd className="px-1.5 py-0.5 rounded border border-line font-mono ml-3">Esc</kbd> close
          </p>
        </div>
      </div>
    </div>
  );
}
