import { useEffect, useRef, useState } from 'react';
import type { GitHubProject } from '../types';
import { getLangColor, getInitials, formatMonth } from '../utils/languageColors';
import { StarIcon, ClockIcon, ArrowIcon } from './Icons';

interface Props {
  project: GitHubProject;
  index?: number;
  onInfo: (p: GitHubProject) => void;
}

export function ProjectCard({ project, index = 0, onInfo }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cards already in viewport → stagger with timeout
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const t = setTimeout(() => setVisible(true), index * 55);
      return () => clearTimeout(t);
    }

    // Off-screen → IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const langColor = getLangColor(project.language);
  const mono      = getInitials(project.name);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <article
      ref={ref}
      className={`project-card${project.featured ? ' project-card--featured' : ''}
                  transition-all duration-500
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      data-i={Math.min(index, 8)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <a href={project.url} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-3 flex-1 min-w-0 group/link">
          <div className="card-icon" aria-hidden="true">{mono}</div>
          <span className="text-[0.9375rem] font-bold text-slate-100 truncate
                           group-hover/link:text-indigo-300 transition-colors">
            {project.name}
          </span>
        </a>
        <div className="flex gap-1.5 flex-shrink-0">
          {project.featured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem]
                             font-bold tracking-wide border border-amber-400/25 bg-amber-400/10
                             text-amber-400">
              Featured
            </span>
          )}
          {project.archived && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem]
                             font-bold tracking-wide border border-slate-600/40 bg-slate-600/10
                             text-slate-500">
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-2">
        {project.description || 'A public GitHub repository.'}
      </p>

      {/* Topics */}
      {project.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.topics.slice(0, 4).map(t => (
            <span key={t}
              className="inline-block px-2 py-0.5 rounded-full text-[0.65rem]
                         border border-white/[0.06] bg-white/[0.02] text-slate-500">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-3
                      border-t border-white/[0.05] mt-auto">
        <div className="flex items-center gap-3.5 flex-wrap min-w-0">
          {project.language && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: langColor }}
                    aria-label={project.language} />
              {project.language}
            </span>
          )}
          {project.stars > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <StarIcon /> {project.stars}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <ClockIcon /> {date}
            </span>
          )}
        </div>

        {/* "More info" button */}
        <button
          onClick={() => onInfo(project)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                     font-semibold text-indigo-400 border border-indigo-500/20
                     hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-300
                     transition-all duration-200 flex-shrink-0"
          aria-label={`More info about ${project.name}`}
        >
          More info <ArrowIcon />
        </button>
      </div>
    </article>
  );
}
