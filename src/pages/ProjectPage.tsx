import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useProjects } from '../hooks/useProjects';
import { getLangColor, formatMonth } from '../utils/languageColors';
import { StarIcon, ClockIcon, ExternalIcon, GithubIcon } from '../components/Icons';

interface Readme {
  text: string;
  branch: string;
}

async function fetchReadme(owner: string, repo: string): Promise<Readme | null> {
  for (const branch of ['main', 'master']) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
        { cache: 'force-cache' }
      );
      if (res.ok) return { text: await res.text(), branch };
    } catch { /* try next branch */ }
  }
  return null;
}

/* GitHub-style slug for heading ids, so in-page anchor links keep working */
function slugify(text: string, seen: Map<string, number>): string {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s+/g, '-');
  const n = seen.get(slug) ?? 0;
  seen.set(slug, n + 1);
  if (n > 0) slug = `${slug}-${n}`;
  return slug;
}

/* Parse, sanitize, and adapt a repo README for display:
   - relative image/link URLs resolved against the repo branch
   - external links open in a new tab
   - headings get GitHub-style ids so #anchors resolve in-page */
function renderReadme(md: string, owner: string, repo: string, branch: string): string {
  const rawBase  = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;
  const isAbsolute = (url: string) =>
    /^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('mailto:');

  const dirty = marked.parse(md, { gfm: true, async: false });
  const clean = DOMPurify.sanitize(dirty, { ADD_ATTR: ['align'] });

  const doc = new DOMParser().parseFromString(clean, 'text/html');

  const seen = new Map<string, number>();
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    h.id = slugify(h.textContent ?? '', seen);
  });

  doc.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') ?? '';
    if (src && !isAbsolute(src)) {
      img.setAttribute('src', rawBase + src.replace(/^\.?\//, ''));
    }
    img.setAttribute('loading', 'lazy');
  });

  doc.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('#')) return; // in-page anchor, handled on click
    if (href && !isAbsolute(href)) {
      a.setAttribute('href', blobBase + href.replace(/^\.?\//, ''));
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  return doc.body.innerHTML;
}

function ReadmeView({ readme, repo }: { readme: Readme; repo: string }) {
  const html = useMemo(
    () => renderReadme(readme.text, 'karangehlod', repo, readme.branch),
    [readme, repo]
  );

  /* In-page anchors would otherwise navigate the hash router; scroll instead */
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = (e.currentTarget as HTMLElement).querySelector(
      `#${CSS.escape(href.slice(1))}`
    );
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="readme panel p-6 sm:p-10" onClick={onClick}
         dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { dataset, status } = useProjects();
  const [readme, setReadme]           = useState<Readme | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);

  const project = dataset?.projects.find(p => p.slug === slug);

  useEffect(() => {
    if (!project) return;
    setReadmeLoading(true);
    fetchReadme('karangehlod', project.name)
      .then(result => setReadme(result))
      .finally(() => setReadmeLoading(false));
  }, [project]);

  /* Loading state */
  if (status === 'loading') {
    return (
      <div className="min-h-screen pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-14 w-2/3" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-4/5" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-12 w-40" />
            <div className="skeleton h-12 w-32" />
          </div>
          <div className="skeleton h-96 mt-8" />
        </div>
      </div>
    );
  }

  /* Not found */
  if (!project) {
    return (
      <div className="min-h-screen pt-36 pb-20">
        <div className="max-w-md mx-auto px-4">
          <div className="panel p-8">
            <h1 className="text-2xl font-semibold text-ink mb-3">
              Project not found
            </h1>
            <p className="mb-8 text-sm text-mut">
              No project matches "{slug}". It may have been renamed or removed.
            </p>
            <Link to="/projects" className="btn btn-primary">
              Back to projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const langColor = getLangColor(project.language);
  const date      = formatMonth(project.pushedAt || project.updatedAt);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="draft-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-10" aria-label="Breadcrumb">
            <Link to="/" className="text-fnt hover:text-signal transition-colors">
              Home
            </Link>
            <span className="text-fnt">/</span>
            <Link to="/projects" className="text-fnt hover:text-signal transition-colors">
              Projects
            </Link>
            <span className="text-fnt">/</span>
            <span className="text-ink font-medium truncate max-w-[200px]">
              {project.name}
            </span>
          </nav>

          {/* Project header */}
          {(project.featured || project.archived) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.featured && <span className="chip chip-signal">Featured</span>}
              {project.archived && <span className="chip">Archived</span>}
            </div>
          )}
          <h1 className="display-wide text-4xl sm:text-6xl text-ink break-words mb-6">
            {project.name}
          </h1>

          {project.description && (
            <p className="text-lg text-mut leading-relaxed mb-6 max-w-[56ch]">
              {project.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-5 mb-6 text-sm text-mut">
            {project.language && (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: langColor }} />
                {project.language}
              </span>
            )}
            {project.stars > 0 && (
              <span className="flex items-center gap-1.5">
                <StarIcon className="w-4 h-4 text-signal" />
                <span className="font-mono">{project.stars}</span>
                {project.stars === 1 ? 'star' : 'stars'}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                Last pushed <span className="font-mono">{date}</span>
              </span>
            )}
          </div>

          {/* Topics */}
          {project.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.topics.map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          )}

          {/* CTAs — stack full-width on mobile, inline on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
               className="btn btn-primary">
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            {project.homepage && (
              <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                 className="btn btn-ghost">
                <ExternalIcon className="w-4 h-4" />
                Open live site
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── README ── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="node-rule fx-rule mb-8"><span>README</span></div>

          {readmeLoading && (
            <div className="space-y-3">
              <div className="skeleton h-7 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/5" />
              <div className="skeleton h-36 mt-2" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          )}

          {!readmeLoading && readme && (
            <ReadmeView readme={readme} repo={project.name} />
          )}

          {!readmeLoading && !readme && (
            <div className="panel border-dashed p-8">
              <p className="text-ink font-semibold mb-1">No README in this repository</p>
              <p className="text-sm text-mut mb-4">
                The project may keep its documentation elsewhere.
              </p>
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                 className="tlink text-sm font-semibold">
                Browse the code on GitHub
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom navigation ── */}
      <div className="border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10
                        flex flex-wrap items-center justify-between gap-4">
          <Link to="/projects" className="tlink text-sm font-semibold">
            Back to projects
          </Link>
          <Link to="/" className="tlink text-sm font-semibold">
            Go to home
          </Link>
        </div>
      </div>
    </>
  );
}
