const COLORS: Record<string, string> = {
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
};

export function getLangColor(lang: string | undefined | null): string {
  if (!lang) return '#64748b';
  return COLORS[lang] ?? '#64748b';
}

export function getInitials(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || (name[0]?.toUpperCase() ?? '?');
}

export function formatMonth(iso: string | undefined | null): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(iso));
}
