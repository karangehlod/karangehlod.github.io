import { useEffect, useState, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { getLangColor, getInitials, formatMonth } from '../utils/languageColors';
import { StarIcon, ClockIcon, ExternalIcon, GithubIcon, ArrowIcon } from '../components/Icons';

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

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={i}
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FullMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const result: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      result.push(
        <h4 key={i} className="text-base font-semibold mt-5 mb-1.5"
            style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(4))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      result.push(
        <h3 key={i} className="text-xl font-bold mt-6 mb-2"
            style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(3))}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      result.push(
        <h2 key={i} className="text-2xl font-bold mt-6 mb-2"
            style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(2))}
        </h2>
      );
    } else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      result.push(
        <pre key={`code-${i}`}
             className="my-4 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed
                        border border-white/[0.06]"
             style={{ background: 'rgba(0,0,0,0.35)', color: 'var(--c-text2)' }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.startsWith('> ')) {
      result.push(
        <blockquote key={i}
                    className="my-3 pl-4 border-l-2 border-indigo-500/40 text-sm italic"
                    style={{ color: 'var(--c-text2)' }}>
          {renderInline(line.slice(2))}
        </blockquote>
      );
    } else if (/^[-*]{3,}$/.test(line.trim())) {
      result.push(<hr key={i} className="my-5 border-white/[0.06]" />);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
              <span className="text-indigo-400 flex-shrink-0 mt-0.5">·</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      result.push(
        <ol key={`ol-${i}`} className="my-2 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
              <span className="text-indigo-400 flex-shrink-0 font-mono text-xs mt-0.5 w-5">
                {j + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === '') {
      result.push(<div key={i} className="h-2" />);
    } else {
      result.push(
        <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0.5">{result}</div>;
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { dataset, status } = useProjects();
  const [readme, setReadme]           = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);

  const project = dataset?.projects.find(p => p.slug === slug);

  useEffect(() => {
    if (!project) return;
    setReadmeLoading(true);
    fetchReadme('karangehlod', project.name)
      .then(text => setReadme(text))
      .finally(() => setReadmeLoading(false));
  }, [project]);

  /* Loading state */
  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="skeleton h-6 w-48 rounded-full" />
          <div className="skeleton h-14 w-2/3 rounded-xl" />
          <div className="skeleton h-5 w-full rounded-lg" />
          <div className="skeleton h-5 w-4/5 rounded-lg" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-12 w-40 rounded-full" />
            <div className="skeleton h-12 w-32 rounded-full" />
          </div>
          <div className="skeleton h-96 rounded-2xl mt-8" />
        </div>
      </div>
    );
  }

  /* Not found */
  if (!project) {
    return (
      <div className="min-h-screen pt-36 pb-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <p className="text-6xl mb-6 opacity-30" aria-hidden="true">🔍</p>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--c-text1)' }}>
            Project not found
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'var(--c-text2)' }}>
            No project matches "{slug}".
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold
                       text-white gradient-bg shadow-lg shadow-indigo-500/25
                       hover:-translate-y-0.5 transition-all duration-200">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const langColor = getLangColor(project.language);
  const mono      = getInitials(project.name);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="hero-blob w-[500px] h-[500px] bg-indigo-600/15 -top-40 -left-20 animate-blob" />
          <div className="hero-blob w-[300px] h-[300px] bg-sky-600/10 top-0 right-0 animate-blob-slow"
               style={{ animationDelay: '-7s' }} />
          <div className="dot-grid" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-10" aria-label="Breadcrumb">
            <Link to="/"
                  className="transition-colors hover:text-indigo-300"
                  style={{ color: 'var(--c-text3)' }}>
              Home
            </Link>
            <span style={{ color: 'var(--c-text3)' }}>/</span>
            <Link to="/projects"
                  className="transition-colors hover:text-indigo-300"
                  style={{ color: 'var(--c-text3)' }}>
              Projects
            </Link>
            <span style={{ color: 'var(--c-text3)' }}>/</span>
            <span className="text-indigo-400 font-medium truncate max-w-[200px]">
              {project.name}
            </span>
          </nav>

          {/* Project header */}
          <div className="flex items-start gap-5 mb-6">
            <div
              className="rounded-2xl flex-shrink-0 grid place-items-center font-black text-white"
              style={{ width: 64, height: 64, fontSize: '1.25rem', background: 'var(--grad)' }}
              aria-hidden="true">
              {mono}
            </div>
            <div className="min-w-0 pt-1">
              {(project.featured || project.archived) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                                     border border-amber-400/25 bg-amber-400/10 text-amber-400">
                      Featured
                    </span>
                  )}
                  {project.archived && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                                     border border-slate-600/40 bg-slate-600/10 text-slate-500">
                      Archived
                    </span>
                  )}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight break-words"
                  style={{ color: 'var(--c-text1)' }}>
                {project.name}
              </h1>
            </div>
          </div>

          {project.description && (
            <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--c-text2)' }}>
              {project.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-5 mb-6">
            {project.language && (
              <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: langColor }} />
                {project.language}
              </span>
            )}
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
            <div className="flex flex-wrap gap-2 mb-8">
              {project.topics.map(t => (
                <span key={t}
                      className="px-3 py-1 rounded-full text-xs border
                                 border-indigo-500/20 bg-indigo-500/[0.06] text-indigo-300">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold
                          text-white gradient-bg shadow-lg shadow-indigo-500/25
                          hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            {project.homepage && (
              <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold
                            border transition-all duration-200 hover:-translate-y-0.5"
                 style={{
                   color: 'var(--c-text1)',
                   borderColor: 'var(--c-border)',
                   background: 'var(--c-card)',
                 }}>
                <ExternalIcon className="w-4 h-4" />
                View Docs
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── README ── */}
      <section className="pb-20 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-indigo-400 mb-2">
            Documentation
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight mb-8"
              style={{ color: 'var(--c-text1)' }}>
            README
          </h2>

          {readmeLoading && (
            <div className="space-y-3">
              <div className="skeleton h-7 w-3/4 rounded-lg" />
              <div className="skeleton h-4 w-full rounded-lg" />
              <div className="skeleton h-4 w-5/6 rounded-lg" />
              <div className="skeleton h-4 w-4/5 rounded-lg" />
              <div className="skeleton h-36 rounded-xl mt-2" />
              <div className="skeleton h-4 w-full rounded-lg" />
              <div className="skeleton h-4 w-3/4 rounded-lg" />
            </div>
          )}

          {!readmeLoading && readme && (
            <div className="p-6 sm:p-8 rounded-2xl border border-white/[0.06]"
                 style={{ background: 'var(--c-card)' }}>
              <FullMarkdown text={readme} />
            </div>
          )}

          {!readmeLoading && !readme && (
            <div className="p-8 rounded-2xl border border-white/[0.06] text-center"
                 style={{ background: 'var(--c-card)' }}>
              <p className="text-4xl mb-3 opacity-30" aria-hidden="true">📄</p>
              <p className="text-sm mb-4" style={{ color: 'var(--c-text3)' }}>
                No README found for this repository.
              </p>
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-sm text-indigo-400
                            hover:text-indigo-300 transition-colors">
                Browse on GitHub <ArrowIcon />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom navigation ── */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10
                        flex flex-wrap items-center justify-between gap-4">
          <Link to="/projects"
                className="flex items-center gap-2 text-sm font-semibold transition-colors
                           hover:text-indigo-300"
                style={{ color: 'var(--c-text2)' }}>
            ← Back to Projects
          </Link>
          <Link to="/"
                className="flex items-center gap-2 text-sm font-semibold transition-colors
                           hover:text-indigo-300"
                style={{ color: 'var(--c-text2)' }}>
            Go to Home →
          </Link>
        </div>
      </div>
    </>
  );
}
