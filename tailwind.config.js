/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'background': 'var(--background)',
        'surface': 'var(--surface)',
        'text': 'var(--text)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'matrix-fall': 'matrixFall 20s linear infinite',
      },
      keyframes: {
        matrixFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.accent"), 0 0 20px theme("colors.accent")',
      }
    },
  },
  plugins: [],
}