/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#06ea61", // Green primary from page2/3
        "primary-blue": "#2e0bda", // Blue primary from page1
        "accent-neon": "#00f3ff", // Cyan
        "accent-pink": "#ff00ff", // Pink
        "background-light": "#f6f5f8",
        "background-dark": "#0f2317", // Dark Greenish from page2
        "background-void": "#050505",
        "surface-dark": "#1d1b2e",
        "alert-red": "#ff2a2a",
        "cyber": {
          bg: '#0f0c29', // Keeping original cyber bg as fallback/option
          secondary: '#302b63',
          accent: '#24243e',
        }
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
        "sans": ["Orbitron", "Inter", "sans-serif"],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(46, 11, 218, 0.5), 0 0 20px rgba(46, 11, 218, 0.3)',
        'neon-green': '0 0 10px rgba(6, 234, 97, 0.5), 0 0 20px rgba(6, 234, 97, 0.3)',
        'neon-cyan': '0 0 5px rgba(0, 243, 255, 0.5), 0 0 10px rgba(0, 243, 255, 0.3)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5)',
        'neon-orange': '0 0 10px rgba(249, 115, 22, 0.5)',
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
        'spin-reverse': 'spin 15s linear infinite reverse',
      }

    },
  },
  plugins: [],
}
