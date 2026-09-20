import { useEffect } from 'react';
import type { PortfolioProject } from '../types';
import { XIcon } from './Icons';
import { PortfolioIcon } from './PortfolioIcon';

interface Props {
  project: PortfolioProject | null;
  open: boolean;
  onClose: () => void;
}

export function PortfolioModal({ project, open, onClose }: Props) {
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

  if (!open || !project) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${project.title}`}
    >
      <div
        className="w-full max-w-2xl bg-panel border border-line-strong rounded-lg
                   max-h-[90vh] overflow-y-auto animate-page-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 pb-4
                        bg-panel border-b border-line">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-md border border-line grid place-items-center
                            flex-shrink-0 text-signal">
              <PortfolioIcon icon={project.icon} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{project.title}</h2>
              <p className="text-sm text-mut">
                {project.company}, {project.period}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded text-fnt hover:text-ink transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <p className="text-mut leading-relaxed">{project.shortDesc}</p>

          {/* Bullet points */}
          <div>
            <div className="node-rule mb-3"><span>What I built</span></div>
            <ul className="space-y-3">
              {project.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm text-mut leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 flex-shrink-0 bg-signal" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech tags */}
          <div>
            <div className="node-rule mb-3"><span>Tech stack</span></div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
