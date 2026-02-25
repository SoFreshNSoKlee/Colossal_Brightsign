/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
          bg: '#ddd9d3',
          surface: '#e8e4de',
          raised: '#f0ece6',
          dark: '#b8b4ae',
          darker: '#9a9690',
          accent: '#5c6bc0',
          'accent-hover': '#7986cb',
          'accent-light': '#e8eaf6',
          accent2: '#7c4dff',
          text: '#2d2a26',
          muted: '#6e6a65',
          green: '#22c55e',
          red: '#ef4444',
          amber: '#f59e0b',
        },
      },
      boxShadow: {
        neo: '5px 5px 10px #b8b4ae, -4px -4px 9px #ffffff',
        'neo-sm': '3px 3px 6px #b8b4ae, -2px -2px 5px #ffffff',
        'neo-lg': '8px 8px 18px #b8b4ae, -6px -6px 14px #ffffff',
        'neo-inset': 'inset 3px 3px 7px #b8b4ae, inset -3px -3px 7px #ffffff',
        'neo-pressed': 'inset 4px 4px 9px #b8b4ae, inset -2px -2px 5px #ffffff',
        'neo-inner': 'inset 2px 2px 5px #b8b4ae, inset -2px -2px 5px #ffffff',
        'neo-accent':
          '5px 5px 10px #b8b4ae, -4px -4px 9px #ffffff, inset 0 0 0 1px rgba(92,107,192,0.2)',
      },
      borderRadius: {
        neo: '20px',
        'neo-sm': '14px',
        'neo-pill': '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'neo-gradient':
          'linear-gradient(145deg, #eeebe5 0%, #ddd9d3 100%)',
        'neo-surface-gradient':
          'linear-gradient(145deg, #f2efe9 0%, #e0ddd7 100%)',
      },
    },
  },
  plugins: [],
}
