/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/site.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#020817',
          surface: '#060f24',
        },
      },
      animation: {
        'blob': 'blob-drift 12s ease-in-out infinite',
        'blob-slow': 'blob-drift 16s ease-in-out infinite',
        'blob-fast': 'blob-drift 9s ease-in-out infinite',
        'fade-up-1': 'fade-up 0.65s cubic-bezier(0.16,1,0.3,1) 0.10s both',
        'fade-up-2': 'fade-up 0.65s cubic-bezier(0.16,1,0.3,1) 0.22s both',
        'fade-up-3': 'fade-up 0.65s cubic-bezier(0.16,1,0.3,1) 0.36s both',
        'fade-up-4': 'fade-up 0.65s cubic-bezier(0.16,1,0.3,1) 0.50s both',
        'fade-up-5': 'fade-up 0.65s cubic-bezier(0.16,1,0.3,1) 0.64s both',
        'dot-pulse': 'dot-pulse 2.5s ease-in-out infinite',
        'scroll-bar': 'scroll-pulse 2.3s ease-in-out infinite',
        'live-glow': 'live-glow 2.2s ease-in-out infinite',
        'card-enter': 'card-enter 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer': 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        'blob-drift': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(22px,-16px) scale(1.04)' },
          '66%': { transform: 'translate(-14px,20px) scale(0.97)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'dot-pulse': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.4', transform: 'scale(0.7)' },
        },
        'scroll-pulse': {
          '0%,100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%':     { opacity: '0.25', transform: 'scaleY(0.5)' },
        },
        'live-glow': {
          '0%,100%': { boxShadow: '0 0 10px rgba(52,211,153,0.55)' },
          '50%':     { boxShadow: '0 0 22px rgba(52,211,153,0.90)' },
        },
        'card-enter': {
          from: { opacity: '0', transform: 'translateY(22px)' },
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
