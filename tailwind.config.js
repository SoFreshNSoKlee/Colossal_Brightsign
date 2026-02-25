/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  safelist: [
    'bg-green-100', 'text-green-700', 'bg-green-500',
    'bg-amber-100', 'text-amber-700', 'bg-amber-500',
    'bg-red-100', 'text-red-700', 'bg-red-500',
    'bg-blue-100', 'text-blue-700', 'bg-blue-500',
    'bg-indigo-100', 'text-indigo-700',
    'bg-gray-100', 'text-gray-700',
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: 'var(--neo-bg)',
          surface: 'var(--neo-surface)',
          raised: 'var(--neo-raised)',
          dark: 'var(--neo-dark)',
          darker: 'var(--neo-darker)',
          accent: 'var(--neo-accent)',
          'accent-hover': 'var(--neo-accent-hover)',
          'accent-light': 'var(--neo-accent-light)',
          accent2: 'var(--neo-accent2)',
          text: 'var(--neo-text)',
          muted: 'var(--neo-muted)',
          green: 'var(--neo-green)',
          red: 'var(--neo-red)',
          amber: 'var(--neo-amber)',
        },
      },
      boxShadow: {
        neo: '5px 5px 10px var(--shadow-dark), -4px -4px 9px var(--shadow-light)',
        'neo-sm': '3px 3px 6px var(--shadow-dark), -2px -2px 5px var(--shadow-light)',
        'neo-lg': '8px 8px 18px var(--shadow-dark), -6px -6px 14px var(--shadow-light)',
        'neo-inset': 'inset 3px 3px 7px var(--shadow-dark), inset -3px -3px 7px var(--shadow-light)',
        'neo-pressed': 'inset 4px 4px 9px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)',
        'neo-inner': 'inset 2px 2px 5px var(--shadow-dark), inset -2px -2px 5px var(--shadow-light)',
        'neo-accent':
          '5px 5px 10px var(--shadow-dark), -4px -4px 9px var(--shadow-light), inset 0 0 0 1px rgba(92,107,192,0.2)',
      },
      borderRadius: {
        neo: '20px',
        'neo-sm': '14px',
        'neo-pill': '9999px',
      },
      fontFamily: {
        sans: ['PPTelegraf', 'system-ui', 'sans-serif'],
        headline: ['NBArchitektStd', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'neo-gradient':
          'linear-gradient(145deg, var(--neo-surface-from) 0%, var(--neo-bg) 100%)',
        'neo-surface-gradient':
          'linear-gradient(145deg, var(--neo-surface-from) 0%, var(--neo-surface-to) 100%)',
      },
    },
  },
  plugins: [],
}
