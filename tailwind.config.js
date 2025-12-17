/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'mesa-orange': '#E88D67',
        'mesa-bg': '#FDF6E3',
        'mesa-sidebar': '#F3E5D8',
        'mesa-text': '#5D4037',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
