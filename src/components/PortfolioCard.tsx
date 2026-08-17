import { useState } from 'react';
import type { PortfolioProject } from '../types';
import { ArrowIcon } from './Icons';
import { PortfolioModal } from './PortfolioModal';
import { PortfolioIcon } from './PortfolioIcon';

interface Props { project: PortfolioProject; }

export function PortfolioCard({ project }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07]
                   hover:-translate-y-1 transition-all duration-300 cursor-default"
        style={{
          ['--hover-bg' as string]: `${project.accentFrom}0d`,
          ['--hover-border' as string]: `${project.accentFrom}40`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = `${project.accentFrom}0d`;
          (e.currentTarget as HTMLElement).style.borderColor = `${project.accentFrom}40`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = '';
          (e.currentTarget as HTMLElement).style.borderColor = '';
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${project.accentFrom}, ${project.accentTo})` }}>
            <PortfolioIcon icon={project.icon} />
          </div>
          <span className="text-xs text-slate-600 flex-shrink-0">{project.period}</span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-100 mb-0.5">{project.title}</h3>
          <p className="text-xs font-semibold" style={{ color: project.accentFrom }}>{project.company}</p>
        </div>

        {/* Short description */}
        <p className="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-3">
          {project.shortDesc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} className="skill-tag">{tag}</span>
          ))}
        </div>

        {/* More info button */}
        <div className="pt-3 border-t border-white/[0.05] mt-auto">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                       border transition-all duration-200"
            style={{ color: project.accentFrom, borderColor: `${project.accentFrom}30` }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${project.accentFrom}12`;
              (e.currentTarget as HTMLElement).style.borderColor = `${project.accentFrom}50`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.borderColor = `${project.accentFrom}30`;
            }}
            aria-label={`More info about ${project.title}`}
          >
            More info <ArrowIcon />
          </button>
        </div>
      </article>

      <PortfolioModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
