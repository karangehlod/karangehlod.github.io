import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GitHubProject } from '../types';
import { getLangColor, getInitials, formatMonth } from '../utils/languageColors';
import { StarIcon, ClockIcon, ArrowIcon, ExternalIcon } from './Icons';

interface Props {
  project: GitHubProject;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const t = setTimeout(() => setVisible(true), index * 55);
      return () => clearTimeout(t);
    }

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
                             font-bold tracking-wide border border-amber-400/30 bg-amber-400/10
                             text-amber-400">
              ★ Featured
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

      {/* Footer — wraps to two rows on very small screens */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-3
                      border-t border-white/[0.05] mt-auto">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
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

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
          {/* Live site link */}
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs
                         font-semibold text-emerald-400 border border-emerald-500/25
                         hover:bg-emerald-500/10 hover:border-emerald-500/40
                         transition-all duration-200"
              aria-label={`Live site for ${project.name}`}
            >
              <ExternalIcon className="w-3 h-3" />
              Live
            </a>
          )}

          {/* Details link */}
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                       font-semibold text-indigo-400 border border-indigo-500/20
                       hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-300
                       transition-all duration-200"
            aria-label={`View details for ${project.name}`}
          >
            Details <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}
