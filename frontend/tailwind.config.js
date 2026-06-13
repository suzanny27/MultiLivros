/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Allow toggling dark mode via class
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#FCFAF7',
          DEFAULT: '#F9F6F0',
          dark: '#EFECE6',
        },
        tobacco: {
          light: '#2D1D13',
          DEFAULT: '#1E130C',
          dark: '#140C08',
        },
        emerald: {
          victorian: '#0F2A1D',
          hover: '#0A1C13',
        },
        gold: {
          old: '#C5A059',
          hover: '#B5904B',
          light: '#DFCB9C',
        },
        coffee: {
          DEFAULT: '#2C1B10',
          muted: '#5C4333',
          light: '#8C7261',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 10px 25px -5px rgba(28, 18, 12, 0.15), 0 8px 10px -6px rgba(28, 18, 12, 0.15)',
        'book-lg': '0 20px 35px -5px rgba(28, 18, 12, 0.25), 0 15px 20px -10px rgba(28, 18, 12, 0.25)',
        'inner-gold': 'inset 0 0 8px rgba(197, 160, 89, 0.3)',
      }
    },
  },
  plugins: [],
}
