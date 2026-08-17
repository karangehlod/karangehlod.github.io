import { useEffect, useState } from 'react';
import type { GitHubProject } from '../types';
import { getLangColor, getInitials, formatMonth } from '../utils/languageColors';
import { StarIcon, ClockIcon, ExternalIcon, GithubIcon, XIcon } from './Icons';

interface Props {
  project: GitHubProject | null;
  onClose: () => void;
}

async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  for (const branch of ['main', 'master']) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
        { cache: 'force-cache' }
      );
      if (res.ok) return res.text();
    } catch { /* try next branch */ }
  }
  return null;
}

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n').slice(0, 80); // limit to 80 lines
  return (
    <div className="text-sm leading-relaxed space-y-1.5" style={{ color: 'var(--c-text2)' }}>
      {lines.map((line, i) => {
        if (line.startsWith('# '))  return <h3 key={i} className="text-base font-bold mt-3" style={{ color: 'var(--c-text1)' }}>{line.slice(2)}</h3>;
        if (line.startsWith('## ')) return <h4 key={i} className="text-sm font-semibold mt-2" style={{ color: 'var(--c-text1)' }}>{line.slice(3)}</h4>;
        if (line.startsWith('### ')) return <h5 key={i} className="text-xs font-semibold mt-1.5" style={{ color: 'var(--c-text1)' }}>{line.slice(4)}</h5>;
        if (line.startsWith('```')) return <div key={i} className="h-px bg-white/5 my-1" />;
        if (line.startsWith('- ') || line.startsWith('* '))
          return <p key={i} className="pl-3 flex gap-2"><span className="text-indigo-400 flex-shrink-0">·</span>{line.slice(2)}</p>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export function ProjectModal({ project, onClose }: Props) {
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);

  useEffect(() => {
    if (!project) { setReadme(null); return; }
    setReadmeLoading(true);
    fetchReadme('karangehlod', project.name)
      .then(text => setReadme(text))
      .finally(() => setReadmeLoading(false));
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [project, onClose]);

  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;

  const langColor = getLangColor(project.language);
  const mono      = getInitials(project.name);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={`Details for ${project.name}`}
    >
      <div
        className="w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto
                   shadow-2xl shadow-indigo-500/10 animate-fade-up-1 border border-indigo-500/20"
        style={{ background: 'var(--c-surf)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 pb-4
                        border-b border-white/[0.05]"
             style={{ background: 'var(--c-surf)' }}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="card-icon flex-shrink-0" aria-hidden="true">{mono}</div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate" style={{ color: 'var(--c-text1)' }}>
                {project.name}
              </h2>
              {project.language && (
                <span className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--c-text3)' }}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: langColor }} />
                  {project.language}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose}
                  className="p-2 rounded-xl transition-colors flex-shrink-0"
                  style={{ color: 'var(--c-text3)' }}
                  aria-label="Close">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {project.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold
                               border border-amber-400/25 bg-amber-400/10 text-amber-400">Featured</span>
            )}
            {project.archived && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold
                               border border-slate-600/40 bg-slate-600/10 text-slate-500">Archived</span>
            )}
          </div>

          {/* Description */}
          <p className="leading-relaxed" style={{ color: 'var(--c-text2)' }}>
            {project.description || 'No description provided for this repository.'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {project.stars > 0 && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--c-text2)' }}>
                <StarIcon className="w-4 h-4 text-amber-400" />
                {project.stars} {project.stars === 1 ? 'star' : 'stars'}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--c-text2)' }}>
                <ClockIcon className="w-4 h-4" />
                Last pushed {date}
              </span>
            )}
          </div>

          {/* Topics */}
          {project.topics.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                 style={{ color: 'var(--c-text3)' }}>Topics</p>
              <div className="flex flex-wrap gap-2">
                {project.topics.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs border
                                           border-indigo-500/20 bg-indigo-500/[0.06] text-indigo-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* README */}
          {(readmeLoading || readme) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                 style={{ color: 'var(--c-text3)' }}>README</p>
              {readmeLoading
                ? <div className="h-24 skeleton rounded-xl" />
                : readme && (
                    <div className="p-4 rounded-xl border border-white/[0.05] max-h-64 overflow-y-auto"
                         style={{ background: 'var(--c-card)' }}>
                      <SimpleMarkdown text={readme} />
                    </div>
                  )
              }
            </div>
          )}
          {!readmeLoading && !readme && (
            <p className="text-xs italic" style={{ color: 'var(--c-text3)' }}>No README found.</p>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                          text-white gradient-bg shadow-lg shadow-indigo-500/25
                          hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            {project.homepage && (
              <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                            border transition-all duration-200 hover:-translate-y-0.5"
                 style={{
                   color: 'var(--c-text1)',
                   borderColor: 'var(--c-border)',
                   background: 'var(--c-card)',
                 }}>
                <ExternalIcon className="w-4 h-4" />
                Live site
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
