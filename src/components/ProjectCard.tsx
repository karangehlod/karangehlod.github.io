import { Link } from 'react-router-dom';
import type { GitHubProject } from '../types';
import { getLangColor, formatMonth } from '../utils/languageColors';
import { StarIcon, ExternalIcon } from './Icons';

interface Props {
  project: GitHubProject;
  index?: number;
}

/* Panel treatment - featured repositories */
export function ProjectCard({ project, index = 0 }: Props) {
  const langColor = getLangColor(project.language);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <article
      className={`panel panel-hover flex flex-col gap-3.5 p-6 fx-rise
                  ${project.featured ? 'panel-featured' : ''}`}
      style={{ '--fxd': `${Math.min(index, 8) * 80}ms` } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <a href={project.url} target="_blank" rel="noopener noreferrer"
           className="min-w-0 text-base font-semibold text-ink truncate hover:text-signal transition-colors">
          {project.name}
        </a>
        {project.archived && (
          <span className="chip flex-shrink-0">Archived</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-mut leading-relaxed flex-1 line-clamp-2">
        {project.description || 'A public GitHub repository.'}
      </p>

      {/* Topics */}
      {project.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.topics.slice(0, 4).map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-3
                      border-t border-line mt-auto">
        <div className="flex items-center gap-3 flex-wrap min-w-0 text-xs text-fnt">
          {project.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: langColor }}
                    aria-label={project.language} />
              {project.language}
            </span>
          )}
          {project.stars > 0 && (
            <span className="flex items-center gap-1">
              <StarIcon /> <span className="font-mono">{project.stars}</span>
            </span>
          )}
          {date && <span className="font-mono">{date}</span>}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-auto text-xs font-semibold">
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-tel hover:underline underline-offset-2"
              aria-label={`Live site for ${project.name}`}
            >
              <ExternalIcon className="w-3 h-3" />
              Live
            </a>
          )}
          <Link
            to={`/projects/${project.slug}`}
            className="tlink"
            aria-label={`View details for ${project.name}`}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

/* Ledger treatment - the all-repositories index */
export function RepoRow({ project, index = 0 }: Props) {
  const langColor = getLangColor(project.language);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="ledger-row group fx-rise"
      style={{ '--fxd': `${Math.min(index, 10) * 45}ms` } as React.CSSProperties}
      aria-label={`View details for ${project.name}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1.5 items-baseline">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="text-sm font-semibold text-ink truncate group-hover:text-signal transition-colors">
              {project.name}
            </span>
            {project.archived && <span className="chip flex-shrink-0">Archived</span>}
          </div>
          <p className="text-sm text-mut leading-relaxed line-clamp-1 mt-0.5">
            {project.description || 'A public GitHub repository.'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-fnt flex-shrink-0">
          {project.language && (
            <span className="flex items-center gap-1.5 w-28">
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: langColor }}
                    aria-label={project.language} />
              <span className="truncate">{project.language}</span>
            </span>
          )}
          <span className="flex items-center gap-1 w-10 justify-end font-mono">
            {project.stars > 0 && (<><StarIcon className="w-3 h-3" />{project.stars}</>)}
          </span>
          <span className="font-mono w-20 text-right hidden sm:block">{date}</span>
        </div>
      </div>
    </Link>
  );
}
