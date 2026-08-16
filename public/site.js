/**
 * site.js — client-side renderer for all pages
 *
 * Architecture: SOLID OOP
 *   S — each class has exactly one reason to change
 *   O — ProjectRenderer is open for extension via subclass
 *   L — substitutability is maintained across all classes
 *   I — FilterController is decoupled from rendering via callback
 *   D — App depends on abstractions, never on concrete DOM ids directly
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   Constants
═══════════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({
  DATA_URL:             './projects.json',
  DATA_CACHE:           'no-store',
  NAV_SCROLL_THRESHOLD: 24,
  STAGGER_STEP_MS:      55,
  STAGGER_MAX_INDEX:    8,
  COUNTER_DURATION_MS:  1100,
  MAX_TOPICS:           5,
  OBSERVER_THRESHOLD:   0.07,
  OBSERVER_MARGIN:      '0px 0px -32px 0px',
  STATS_THRESHOLD:      0.40,
  FILTER_FADE_MS:       150,
});

const LANGUAGE_COLORS = Object.freeze({
  'Python':           '#3572A5',
  'JavaScript':       '#f1e05a',
  'TypeScript':       '#3178c6',
  'Java':             '#b07219',
  'Go':               '#00ADD8',
  'Rust':             '#dea584',
  'C++':              '#f34b7d',
  'C':                '#555555',
  'C#':               '#178600',
  'Ruby':             '#701516',
  'PHP':              '#4F5D95',
  'Swift':            '#F05138',
  'Kotlin':           '#A97BFF',
  'Shell':            '#89e051',
  'HTML':             '#e34c26',
  'CSS':              '#563d7c',
  'Vue':              '#41b883',
  'Jupyter Notebook': '#DA5B0B',
  'Dockerfile':       '#384d54',
  'Svelte':           '#ff3e00',
  'Astro':            '#ff5a03',
  'R':                '#198CE7',
  'Dart':             '#00B4AB',
});

const FALLBACK_LANG_COLOR = '#64748b';

/* ═══════════════════════════════════════════════════════════════
   Icons
═══════════════════════════════════════════════════════════════ */

const Icons = Object.freeze({
  star:
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
          aria-hidden="true" focusable="false">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`,

  clock:
    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>`,

  arrow:
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true" focusable="false">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>`,
});

/* ═══════════════════════════════════════════════════════════════
   LanguageService  — SRP: language presentation metadata
═══════════════════════════════════════════════════════════════ */

class LanguageService {
  /** @param {string|null|undefined} language */
  getColor(language) {
    if (!language) return FALLBACK_LANG_COLOR;
    return LANGUAGE_COLORS[language] ?? FALLBACK_LANG_COLOR;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TextFormatter  — SRP: pure text transforms, no side-effects
═══════════════════════════════════════════════════════════════ */

class TextFormatter {
  initials(name) {
    return name
      .replace(/[-_]/g, ' ')
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('') || (name[0]?.toUpperCase() ?? '?');
  }

  monthYear(isoDate) {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
      .format(new Date(isoDate));
  }
}

/* ═══════════════════════════════════════════════════════════════
   ProjectCardFactory  — SRP: builds card DOM from project data
                         OCP: override private methods in subclass
═══════════════════════════════════════════════════════════════ */

class ProjectCardFactory {
  #lang;
  #fmt;

  constructor(langService, formatter) {
    this.#lang = langService;
    this.#fmt  = formatter;
  }

  /**
   * @param {object}  project
   * @param {boolean} featured
   * @param {number}  index     stagger slot (0–8)
   * @returns {HTMLElement}
   */
  create(project, featured = false, index = 0) {
    const card = document.createElement('article');
    card.className = `project-card${featured ? ' project-card--featured' : ''}`;
    card.dataset.i = String(Math.min(index, CONFIG.STAGGER_MAX_INDEX));

    card.innerHTML =
      this.#header(project) +
      this.#description(project) +
      this.#topics(project) +
      this.#footer(project);

    return card;
  }

  #header(p) {
    const mono = this.#fmt.initials(p.name);
    const featuredBadge = p.featured
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem]
                      font-bold tracking-wide border border-amber-400/25 bg-amber-400/10
                      text-amber-400">Featured</span>`
      : '';
    const archivedBadge = p.archived
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem]
                      font-bold tracking-wide border border-slate-600/40 bg-slate-600/10
                      text-slate-500">Archived</span>`
      : '';

    return `
      <div class="flex items-start justify-between gap-3">
        <a href="${p.url}" target="_blank" rel="noopener noreferrer"
           class="flex items-center gap-3 flex-1 min-w-0 group/link">
          <div class="card-icon" aria-hidden="true">${mono}</div>
          <span class="text-[0.9375rem] font-bold text-slate-100 truncate
                       group-hover/link:text-indigo-300 transition-colors">
            ${p.name}
          </span>
        </a>
        <div class="flex gap-1.5 flex-shrink-0">${featuredBadge}${archivedBadge}</div>
      </div>`;
  }

  #description(p) {
    const text = p.description || 'A public GitHub repository.';
    return `
      <p class="text-sm text-slate-400 leading-relaxed flex-1
                line-clamp-3 overflow-hidden">
        ${text}
      </p>`;
  }

  #topics(p) {
    const topics = (p.topics ?? []).slice(0, CONFIG.MAX_TOPICS);
    if (!topics.length) return '';
    const pills = topics.map(t =>
      `<span class="inline-block px-2 py-0.5 rounded-full text-[0.65rem]
                    border border-white/[0.06] bg-white/[0.02] text-slate-500
                    transition-colors duration-200">
        ${t}
      </span>`
    ).join('');
    return `<div class="flex flex-wrap gap-1.5">${pills}</div>`;
  }

  #footer(p) {
    const lang = this.#langMeta(p);
    const stars = this.#starMeta(p);
    const date = this.#dateMeta(p);

    return `
      <div class="flex items-center justify-between gap-3 pt-3
                  border-t border-white/[0.05] mt-auto">
        <div class="flex items-center gap-3.5 flex-wrap min-w-0">
          ${lang}${stars}${date}
        </div>
        <a href="${p.url}" target="_blank" rel="noopener noreferrer"
           class="card-view-link" aria-label="View ${p.name} on GitHub">
          View ${Icons.arrow}
        </a>
      </div>`;
  }

  #langMeta(p) {
    if (!p.language) return '';
    const color = this.#lang.getColor(p.language);
    return `
      <span class="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
        <span class="lang-dot w-2.5 h-2.5 rounded-full flex-shrink-0"
              style="background:${color}" aria-label="${p.language}"></span>
        ${p.language}
      </span>`;
  }

  #starMeta(p) {
    if (!p.stars) return '';
    return `
      <span class="flex items-center gap-1 text-xs text-slate-500">
        ${Icons.star}${p.stars}
      </span>`;
  }

  #dateMeta(p) {
    const date = this.#fmt.monthYear(p.pushedAt || p.updatedAt);
    if (!date) return '';
    return `
      <span class="flex items-center gap-1 text-xs text-slate-500">
        ${Icons.clock}${date}
      </span>`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   ProjectRepository  — SRP: data access only
═══════════════════════════════════════════════════════════════ */

class ProjectRepository {
  async fetchDataset() {
    const res = await fetch(CONFIG.DATA_URL, { cache: CONFIG.DATA_CACHE });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}

/* ═══════════════════════════════════════════════════════════════
   ScrollAnimator  — SRP: staggered card entrance animations
   Uses IntersectionObserver for cards below the fold; forces
   immediate visibility for cards already in the viewport so they
   never stay hidden due to observer timing edge-cases.
═══════════════════════════════════════════════════════════════ */

class ScrollAnimator {
  #observer = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('card-visible');
          this.#observer.unobserve(e.target);
        }
      }
    },
    { threshold: 0.01, rootMargin: '0px' }
  );

  /** @param {Iterable<Element>} elements */
  watch(elements) {
    const list = [...elements];

    // After layout settles, check each card. Cards already in the
    // viewport get an immediate staggered show; off-screen cards
    // rely on the IntersectionObserver as they scroll into view.
    requestAnimationFrame(() => {
      const vpBottom = window.innerHeight;
      list.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < vpBottom) {
          // In viewport — show with staggered delay
          setTimeout(() => card.classList.add('card-visible'), i * CONFIG.STAGGER_STEP_MS);
        } else {
          // Below fold — let IntersectionObserver handle it
          this.#observer.observe(card);
        }
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   SectionReveal  — SRP: scroll-triggered section animations
═══════════════════════════════════════════════════════════════ */

class SectionReveal {
  #observer = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          this.#observer.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  init() {
    document.querySelectorAll('.reveal').forEach(el => this.#observer.observe(el));
  }
}

/* ═══════════════════════════════════════════════════════════════
   StatsController  — SRP: owns the stats band + animated counters
═══════════════════════════════════════════════════════════════ */

class StatsController {
  /** @param {object} dataset */
  populate(dataset) {
    const projects  = dataset.projects ?? [];
    const langCount = new Set(projects.map(p => p.language).filter(Boolean)).size;
    const starTotal = projects.reduce((s, p) => s + (p.stars ?? 0), 0);

    const targets = [
      { ids: ['stat-repos', 'stat-repos-hero'], value: projects.length },
      { ids: ['stat-langs', 'stat-langs-hero'], value: langCount },
      { ids: ['stat-stars'],                    value: starTotal },
    ];

    const runCounters = () => {
      for (const { ids, value } of targets) {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el) this.#countUp(el, value);
        }
      }
    };

    // Watch the first stat element — it's always visible on page load.
    // Fall back to running immediately if no stat elements exist on this page.
    const firstStatId = targets.flatMap(t => t.ids).find(id => document.getElementById(id));
    const anchor = firstStatId ? document.getElementById(firstStatId) : null;

    if (!anchor) return; // no stats on this page

    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      runCounters();
    }, { threshold: 0.1 });

    observer.observe(anchor);
  }

  #countUp(el, target) {
    if (target === 0) { el.textContent = '0'; return; }
    const started = performance.now();
    const tick = now => {
      const t = Math.min((now - started) / CONFIG.COUNTER_DURATION_MS, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* ═══════════════════════════════════════════════════════════════
   FilterController  — SRP: filter bar UI + state
                       ISP: notifies consumer via callback only
═══════════════════════════════════════════════════════════════ */

class FilterController {
  #active = '';
  #langService;
  #onChange;

  constructor(langService, onChange) {
    this.#langService = langService;
    this.#onChange    = onChange;
  }

  mount(container, projects) {
    const langs = [...new Set(projects.map(p => p.language).filter(Boolean))].sort();

    container.replaceChildren(this.#chip('', 'All', true));
    for (const lang of langs) container.append(this.#chip(lang, lang, false));

    container.addEventListener('click', e => this.#onClick(e));
  }

  #onClick(e) {
    const chip = e.target.closest('[data-lang]');
    if (!chip || chip.dataset.lang === this.#active) return;
    this.#active = chip.dataset.lang;
    chip.closest('nav').querySelectorAll('[data-lang]')
        .forEach(c => {
          const on = c.dataset.lang === this.#active;
          c.className = this.#chipClass(on);
        });
    this.#onChange(this.#active);
  }

  #chip(lang, label, active) {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = this.#chipClass(active);
    btn.dataset.lang = lang;

    if (lang) {
      const dot = document.createElement('span');
      dot.className = 'lang-dot w-2.5 h-2.5 rounded-full flex-shrink-0';
      dot.style.background = this.#langService.getColor(lang);
      dot.setAttribute('aria-hidden', 'true');
      btn.append(dot);
    }
    btn.append(document.createTextNode(label));
    return btn;
  }

  #chipClass(active) {
    const base = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium '
               + 'border transition-all duration-200 cursor-pointer';
    return active
      ? `${base} bg-indigo-500/12 border-indigo-500/40 text-indigo-300`
      : `${base} bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-100 `
      + `hover:bg-indigo-500/8 hover:border-indigo-500/30 hover:-translate-y-px`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   ProjectRenderer  — SRP: renders projects into DOM containers
                     OCP: subclass to override renderFeatured/renderAll
═══════════════════════════════════════════════════════════════ */

class ProjectRenderer {
  #factory;
  #animator;

  constructor(factory, animator) {
    this.#factory  = factory;
    this.#animator = animator;
  }

  renderFeatured(container, projects) {
    this.#fill(container, projects, { featured: true, instant: false });
  }

  renderAll(container, projects, instant = false) {
    this.#fill(container, projects, { featured: false, instant });
  }

  renderSkeleton(container, count, tall = false) {
    container.replaceChildren();
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.className = `skeleton ${tall ? 'h-60' : 'h-48'}`;
      div.setAttribute('aria-hidden', 'true');
      frag.append(div);
    }
    container.append(frag);
  }

  renderError(container, message) {
    container.replaceChildren(this.#stateCard('📡', message));
  }

  renderEmpty(container, message) {
    container.replaceChildren(this.#stateCard('📭', message));
  }

  #fill(container, projects, { featured, instant }) {
    container.replaceChildren();

    if (!projects.length) {
      this.renderEmpty(container, 'No repositories available at this time.');
      return;
    }

    const frag  = document.createDocumentFragment();
    const cards = projects.map((p, i) => this.#factory.create(p, featured, i));
    if (instant) cards.forEach(c => c.classList.add('card-visible'));
    frag.append(...cards);
    container.append(frag);

    if (!instant) this.#animator.watch(container.querySelectorAll('.project-card'));
  }

  #stateCard(icon, message) {
    const div = document.createElement('div');
    div.className = 'col-span-full flex flex-col items-center justify-center py-20 '
                  + 'border border-dashed border-indigo-500/15 rounded-2xl text-center';
    div.innerHTML = `
      <span class="text-4xl mb-4 opacity-40" aria-hidden="true">${icon}</span>
      <p class="text-slate-500 text-sm">${message}</p>`;
    return div;
  }
}

/* ═══════════════════════════════════════════════════════════════
   NavigationController  — SRP: sticky-nav behaviour
═══════════════════════════════════════════════════════════════ */

class NavigationController {
  #nav;
  constructor(nav) { this.#nav = nav; }
  init() {
    const update = () =>
      this.#nav.classList.toggle('nav-scrolled', window.scrollY > CONFIG.NAV_SCROLL_THRESHOLD);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
}

/* ═══════════════════════════════════════════════════════════════
   App  — orchestrator; DIP: depends on abstractions throughout
═══════════════════════════════════════════════════════════════ */

class App {
  #repo      = new ProjectRepository();
  #lang      = new LanguageService();
  #fmt       = new TextFormatter();
  #animator  = new ScrollAnimator();
  #stats     = new StatsController();
  #reveal    = new SectionReveal();
  #factory;
  #renderer;

  constructor() {
    this.#factory  = new ProjectCardFactory(this.#lang, this.#fmt);
    this.#renderer = new ProjectRenderer(this.#factory, this.#animator);
  }

  async init() {
    this.#bootNav();
    this.#reveal.init();
    this.#showSkeletons();

    try {
      const dataset = await this.#repo.fetchDataset();
      this.#present(dataset);
    } catch (err) {
      console.error('[App] Failed to load project data:', err);
      this.#showError();
    }
  }

  #bootNav() {
    const nav = document.getElementById('main-nav');
    if (nav) new NavigationController(nav).init();
  }

  #showSkeletons() {
    const r = this.#renderer;
    this.#withEl('featured-grid', el => r.renderSkeleton(el, 3, true));
    this.#withEl('all-grid',      el => r.renderSkeleton(el, 8, false));
  }

  #present(dataset) {
    const r        = this.#renderer;
    const projects = dataset.projects ?? [];

    this.#withEl('featured-grid', el => r.renderFeatured(el, dataset.featuredProjects ?? []));
    this.#withEl('all-grid',      el => r.renderAll(el, projects));

    this.#stats.populate(dataset);
    this.#mountFilter(projects);
  }

  #showError() {
    const msg = 'Project data could not be loaded. Please try again later.';
    const r   = this.#renderer;
    this.#withEl('featured-grid', el => r.renderError(el, msg));
    this.#withEl('all-grid',      el => r.renderError(el, msg));
  }

  #mountFilter(projects) {
    const filterEl = document.getElementById('lang-filter');
    const gridEl   = document.getElementById('all-grid');
    if (!filterEl || !gridEl) return;

    const r      = this.#renderer;
    const filter = new FilterController(this.#lang, lang => {
      const subset = lang ? projects.filter(p => p.language === lang) : projects;
      this.#fadeOut(gridEl, () => r.renderAll(gridEl, subset, true));
    });
    filter.mount(filterEl, projects);
  }

  #fadeOut(container, renderFn) {
    for (const card of container.querySelectorAll('.project-card')) {
      card.style.transition = `opacity ${CONFIG.FILTER_FADE_MS}ms, transform ${CONFIG.FILTER_FADE_MS}ms`;
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(8px)';
    }
    setTimeout(renderFn, CONFIG.FILTER_FADE_MS);
  }

  #withEl(id, fn) {
    const el = document.getElementById(id);
    if (el) fn(el);
  }
}

/* ═══════════════════════════════════════════════════════════════
   Bootstrap
═══════════════════════════════════════════════════════════════ */

new App().init().catch(console.error);
