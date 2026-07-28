/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0e0e10',
        surface: '#1a1a1e',
        surface2: '#242428',
        accent: '#e84b4b',
      },
    },
  },
  plugins: [],
};
