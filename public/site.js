// ── Language colours (based on GitHub's palette) ─────────────────────────────
const LANG_COLORS = {
  'Python': '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'C++': '#f34b7d',
  'C': '#555555',
  'C#': '#178600',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Scala': '#c22d40',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Vue': '#41b883',
  'Jupyter Notebook': '#DA5B0B',
  'Dockerfile': '#384d54',
  'Svelte': '#ff3e00',
  'Astro': '#ff5a03',
  'R': '#198CE7',
  'Dart': '#00B4AB',
};

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ICON_STAR = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
const ICON_CLOCK = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`;
const ICON_ARROW = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name) {
  return name.replace(/[-_]/g, ' ')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || (name[0]?.toUpperCase() ?? '?');
}

function shortDate(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
    .format(new Date(iso));
}

function langColor(lang) {
  return LANG_COLORS[lang] ?? '#64748b';
}

// ── Build a project card element ──────────────────────────────────────────────
function buildCard(project, featured = false, idx = 0) {
  const card = document.createElement('article');
  card.className = 'project-card' + (featured ? ' project-card--featured' : '');
  card.dataset.i = String(Math.min(idx, 8));

  const mono = initials(project.name);
  const lc = langColor(project.language);
  const date = shortDate(project.pushedAt || project.updatedAt);
  const topics = (project.topics ?? []).slice(0, 5);

  const topicsHtml = topics.length
    ? `<div class="card-topics">${topics.map(t => `<span class="topic">${t}</span>`).join('')}</div>`
    : '';

  const langHtml = project.language
    ? `<span class="meta-bit">
         <span class="lang-dot" style="background:${lc}" aria-label="${project.language}"></span>
         ${project.language}
       </span>`
    : '';

  const starsHtml = project.stars > 0
    ? `<span class="meta-bit">${ICON_STAR}${project.stars}</span>`
    : '';

  const dateHtml = date
    ? `<span class="meta-bit">${ICON_CLOCK}${date}</span>`
    : '';

  const featuredBadge = project.featured
    ? `<span class="badge badge-featured">Featured</span>`
    : '';

  const archivedBadge = project.archived
    ? `<span class="badge badge-archived">Archived</span>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="card-name-link">
        <div class="card-icon" aria-hidden="true">${mono}</div>
        <span class="card-name">${project.name}</span>
      </a>
      <div class="card-badges">${featuredBadge}${archivedBadge}</div>
    </div>
    <p class="card-desc">${project.description || 'A public GitHub repository.'}</p>
    ${topicsHtml}
    <div class="card-footer">
      <div class="card-meta">
        ${langHtml}${starsHtml}${dateHtml}
      </div>
      <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="card-view-link" aria-label="View ${project.name} on GitHub">
        View ${ICON_ARROW}
      </a>
    </div>
  `;

  return card;
}

// ── Empty / error state ───────────────────────────────────────────────────────
function buildEmpty(msg) {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `<div class="empty-icon" aria-hidden="true">📭</div><p class="empty-msg">${msg}</p>`;
  return div;
}

// ── Scroll-triggered entrance animation ──────────────────────────────────────
const entryObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entryObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
);

function watchCards(container) {
  for (const card of container.querySelectorAll('.project-card')) {
    entryObserver.observe(card);
  }
}

// ── Render helpers ────────────────────────────────────────────────────────────
function renderCards(container, projects, featured = false) {
  container.replaceChildren();

  if (!projects.length) {
    container.append(buildEmpty('No repositories available at this time.'));
    return;
  }

  const frag = document.createDocumentFragment();
  projects.forEach((p, i) => frag.append(buildCard(p, featured, i)));
  container.append(frag);
  watchCards(container);
}

function renderCardsInstant(container, projects) {
  container.replaceChildren();

  if (!projects.length) {
    container.append(buildEmpty('No repositories match this filter.'));
    return;
  }

  const frag = document.createDocumentFragment();
  projects.forEach((p, i) => {
    const card = buildCard(p, false, i);
    card.classList.add('visible');
    frag.append(card);
  });
  container.append(frag);
}

// ── Stats counter animation ───────────────────────────────────────────────────
function animateCount(el, target, duration = 1100) {
  if (target === 0) { el.textContent = '0'; return; }
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateStats(dataset) {
  const projects = dataset.projects ?? [];
  const reposEl = document.getElementById('stat-repos');
  const langsEl = document.getElementById('stat-langs');
  const starsEl = document.getElementById('stat-stars');

  if (!reposEl || !langsEl || !starsEl) return;

  const totalLangs = new Set(projects.map(p => p.language).filter(Boolean)).size;
  const totalStars = projects.reduce((s, p) => s + (p.stars ?? 0), 0);

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCount(reposEl, projects.length);
      animateCount(langsEl, totalLangs);
      animateCount(starsEl, totalStars);
      obs.disconnect();
    }
  }, { threshold: 0.4 });

  const band = document.querySelector('.stats-band');
  if (band) obs.observe(band);
}

// ── Language filter ───────────────────────────────────────────────────────────
function setupFilter(allProjects, allContainer) {
  const bar = document.getElementById('lang-filter');
  if (!bar) return;

  const langs = [...new Set(allProjects.map(p => p.language).filter(Boolean))].sort();

  for (const lang of langs) {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.dataset.lang = lang;
    const dot = `<span class="lang-dot" style="background:${langColor(lang)}" aria-hidden="true"></span>`;
    btn.innerHTML = `${dot}${lang}`;
    bar.append(btn);
  }

  let active = '';

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn || btn.dataset.lang === active) return;

    active = btn.dataset.lang;

    for (const c of bar.querySelectorAll('.chip')) {
      c.classList.toggle('chip-active', c.dataset.lang === active);
    }

    const filtered = active
      ? allProjects.filter(p => p.language === active)
      : allProjects;

    // Fade out existing cards, then swap content
    for (const card of allContainer.querySelectorAll('.project-card')) {
      card.style.transition = 'opacity 0.15s, transform 0.15s';
      card.style.opacity = '0';
      card.style.transform = 'translateY(6px)';
    }

    setTimeout(() => renderCardsInstant(allContainer, filtered), 160);
  });
}

// ── Sticky nav scroll effect ──────────────────────────────────────────────────
function setupNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Main ──────────────────────────────────────────────────────────────────────
setupNav();

const featuredGrid = document.getElementById('featured-grid');
const allGrid = document.getElementById('all-grid');

try {
  const res = await fetch('./projects.json', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — unable to load project data`);
  }

  const dataset = await res.json();

  renderCards(featuredGrid, dataset.featuredProjects ?? [], true);
  renderCards(allGrid, dataset.projects ?? [], false);
  animateStats(dataset);
  setupFilter(dataset.projects ?? [], allGrid);

} catch (err) {
  console.error('[site.js] Failed to load projects.json:', err);
  featuredGrid?.replaceChildren(buildEmpty('Project data could not be loaded. Please try again later.'));
  allGrid?.replaceChildren(buildEmpty('Project data could not be loaded. Please try again later.'));
}
