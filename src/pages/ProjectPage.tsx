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

// Matches (in priority order): image, link, bold, italic, inline-code
const INLINE_RE = /!\[([^\]]*)\]\(([^)\s]+)[^)]*\)|\[([^\]]+)\]\(([^)\s]+)[^)]*\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key  = 0;
  let m: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;

  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));

    if (m[2]) {
      // Image: ![alt](url)
      nodes.push(
        <img key={key++} src={m[2]} alt={m[1] || ''}
             className="inline-block max-h-5 align-middle"
             onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      );
    } else if (m[4]) {
      // Link: [text](url)
      nodes.push(
        <a key={key++} href={m[4]} target="_blank" rel="noopener noreferrer"
           className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
          {m[3]}
        </a>
      );
    } else if (m[5]) {
      // Bold: **text**
      nodes.push(<strong key={key++} className="font-semibold text-slate-100">{m[5]}</strong>);
    } else if (m[6]) {
      // Italic: *text*
      nodes.push(<em key={key++} className="italic text-slate-300">{m[6]}</em>);
    } else if (m[7]) {
      // Code: `text`
      nodes.push(
        <code key={key++}
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc' }}>
          {m[7]}
        </code>
      );
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Detect lines that are only a block-level image
const BLOCK_IMG_RE = /^!\[([^\]]*)\]\(([^)\s]+)[^)]*\)\s*$/;

// Detect table rows (used in multi-line table detection)
const TABLE_ROW_RE = /^\|.+\|$/;
const TABLE_SEP_RE = /^\|[-| :]+\|$/;

function FullMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const result: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Heading 3
    if (line.startsWith('#### ')) {
      result.push(
        <h5 key={i} className="text-sm font-semibold mt-4 mb-1" style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(5))}
        </h5>
      );
      i++;

    // ── Heading 3
    } else if (line.startsWith('### ')) {
      result.push(
        <h4 key={i} className="text-base font-semibold mt-5 mb-1.5" style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;

    // ── Heading 2
    } else if (line.startsWith('## ')) {
      result.push(
        <h3 key={i} className="text-xl font-bold mt-7 mb-2" style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;

    // ── Heading 1
    } else if (line.startsWith('# ')) {
      result.push(
        <h2 key={i} className="text-2xl font-bold mt-7 mb-2" style={{ color: 'var(--c-text1)' }}>
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;

    // ── Fenced code block
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      result.push(
        <div key={`code-${i}`} className="my-4 relative">
          {lang && (
            <span className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-600 select-none uppercase">
              {lang}
            </span>
          )}
          <pre className="p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-white/[0.06]"
               style={{ background: 'rgba(0,0,0,0.35)', color: 'var(--c-text2)' }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );

    // ── Blockquote
    } else if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      result.push(
        <blockquote key={`bq-${i}`}
                    className="my-3 pl-4 border-l-2 border-indigo-500/40 space-y-1">
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="text-sm italic" style={{ color: 'var(--c-text2)' }}>
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>
      );

    // ── Horizontal rule
    } else if (/^[-*_]{3,}$/.test(trimmed)) {
      result.push(<hr key={i} className="my-6 border-white/[0.07]" />);
      i++;

    // ── Table
    } else if (TABLE_ROW_RE.test(trimmed)) {
      const tableLines: string[] = [];
      while (i < lines.length && TABLE_ROW_RE.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }
      // Parse: first row = headers, second row = separator, rest = body
      const rows = tableLines.filter(l => !TABLE_SEP_RE.test(l.trim()));
      const headers = rows[0]?.split('|').map(c => c.trim()).filter(Boolean) ?? [];
      const body = rows.slice(1);
      result.push(
        <div key={`tbl-${i}`} className="my-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi}
                      className="px-3 py-2 text-left font-semibold border-b border-white/[0.08]"
                      style={{ color: 'var(--c-text1)' }}>
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => {
                const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                return (
                  <tr key={ri} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2" style={{ color: 'var(--c-text2)' }}>
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    // ── Unordered list (also handles indented sub-items)
    } else if (/^(\s*)([-*+]) /.test(line)) {
      const items: { text: string; depth: number }[] = [];
      while (i < lines.length && /^(\s*)([-*+]) /.test(lines[i])) {
        const dm = lines[i].match(/^(\s*)([-*+]) (.*)/);
        items.push({ text: dm?.[3] ?? '', depth: Math.floor((dm?.[1]?.length ?? 0) / 2) });
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1">
          {items.map((item, j) => (
            <li key={j}
                className="flex gap-2 text-sm"
                style={{ color: 'var(--c-text2)', paddingLeft: `${item.depth * 1}rem` }}>
              <span className="text-indigo-400 flex-shrink-0 mt-0.5">·</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );

    // ── Ordered list
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
              <span className="text-indigo-400 flex-shrink-0 font-mono text-xs mt-0.5 w-5 text-right">
                {j + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );

    // ── Block-level standalone image
    } else if (BLOCK_IMG_RE.test(trimmed)) {
      const m = trimmed.match(BLOCK_IMG_RE)!;
      result.push(
        <div key={i} className="my-4 flex justify-center">
          <img src={m[2]} alt={m[1] || ''}
               className="max-w-full h-auto rounded-xl border border-white/[0.06]"
               loading="lazy"
               onError={e => { (e.target as HTMLImageElement).parentElement!.remove(); }} />
        </div>
      );
      i++;

    // ── Empty line (paragraph break)
    } else if (trimmed === '') {
      result.push(<div key={i} className="h-3" />);
      i++;

    // ── Plain paragraph: group consecutive plain lines
    } else {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('```') &&
        !/^(\s*)([-*+]) /.test(lines[i]) &&
        !/^\d+\. /.test(lines[i]) &&
        !lines[i].startsWith('> ') &&
        !lines[i].startsWith('|') &&
        !/^[-*_]{3,}$/.test(lines[i].trim()) &&
        !BLOCK_IMG_RE.test(lines[i].trim())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        result.push(
          <p key={`p-${i}`} className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>
            {renderInline(paraLines.join(' '))}
          </p>
        );
      }
    }
  }

  return <div className="space-y-1">{result}</div>;
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

          {/* CTAs — stack full-width on mobile, inline on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={project.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3
                          rounded-full text-sm font-semibold text-white gradient-bg
                          shadow-lg shadow-indigo-500/25
                          hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200
                          active:scale-[0.98]">
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            {project.homepage && (
              <a href={project.homepage} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3
                            rounded-full text-sm font-semibold border
                            transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                 style={{
                   color: 'var(--c-text1)',
                   borderColor: 'var(--c-border)',
                   background: 'var(--c-card)',
                 }}>
                <ExternalIcon className="w-4 h-4" />
                Live Site
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
