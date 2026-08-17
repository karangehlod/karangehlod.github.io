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
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${project.title}`}
    >
      <div
        className="w-full max-w-2xl bg-[#0a1628] rounded-3xl max-h-[90vh] overflow-y-auto
                   shadow-2xl animate-fade-up-1"
        style={{ borderWidth: 1, borderStyle: 'solid', borderColor: `${project.accentFrom}30` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 pb-4
                        bg-[#0a1628]"
             style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: `${project.accentFrom}20` }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0"
                 style={{ background: `linear-gradient(135deg, ${project.accentFrom}, ${project.accentTo})` }}>
              <PortfolioIcon icon={project.icon} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{project.title}</h2>
              <p className="text-sm font-medium" style={{ color: project.accentFrom }}>
                {project.company} · {project.period}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-100
                       hover:bg-white/[0.06] transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <p className="text-slate-300 leading-relaxed">{project.shortDesc}</p>

          {/* Bullet points */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">
              What I built
            </p>
            <ul className="space-y-3">
              {project.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: project.accentFrom }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech tags */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">
              Tech stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag}
                  className="px-2.5 py-1 rounded-full text-xs border"
                  style={{
                    color: project.accentFrom,
                    borderColor: `${project.accentFrom}30`,
                    background: `${project.accentFrom}0a`,
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
