/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ground:    'var(--ground)',
        panel:     'var(--panel)',
        'panel-hi': 'var(--panel-hi)',
        ink:       'var(--ink)',
        mut:       'var(--muted)',
        fnt:       'var(--faint)',
        signal:    'var(--signal)',
        'signal-ink': 'var(--signal-ink)',
        tel:       'var(--telemetry)',
        alert:     'var(--alert)',
        line:      'var(--line)',
        'line-strong': 'var(--line-strong)',
      },
      animation: {
        'page-enter': 'page-rise 0.32s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
      keyframes: {
        'page-rise': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-640px 0' },
          '100%': { backgroundPosition:  '640px 0' },
        },
      },
    },
  },
  plugins: [],
};
