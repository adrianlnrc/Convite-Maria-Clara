/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        cream: '#f0e6d3',
        'dark-red': '#8b1a1a',
        'deep-red': '#5c0d0d',
      },
    },
  },
  plugins: [],
}
