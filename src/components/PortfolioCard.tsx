import { useState } from 'react';
import type { PortfolioProject } from '../types';
import { PortfolioModal } from './PortfolioModal';
import { PortfolioIcon } from './PortfolioIcon';

interface Props { project: PortfolioProject; index?: number; }

export function PortfolioCard({ project, index = 0 }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="panel panel-hover panel-featured flex flex-col gap-4 p-6 fx-rise"
               style={{ '--fxd': `${Math.min(index, 8) * 80}ms` } as React.CSSProperties}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-md border border-line grid place-items-center
                          flex-shrink-0 text-signal">
            <PortfolioIcon icon={project.icon} />
          </div>
          <span className="text-xs font-mono text-fnt flex-shrink-0">{project.period}</span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-ink mb-0.5">{project.title}</h3>
          <p className="text-xs font-medium text-mut">{project.company}</p>
        </div>

        {/* Short description */}
        <p className="text-sm text-mut leading-relaxed flex-1 line-clamp-3">
          {project.shortDesc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>

        {/* More info button */}
        <div className="pt-3 border-t border-line mt-auto">
          <button
            onClick={() => setOpen(true)}
            className="tlink text-xs font-semibold"
            aria-label={`More info about ${project.title}`}
          >
            Read the full case
          </button>
        </div>
      </article>

      <PortfolioModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
