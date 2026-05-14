/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#111111',
          border: '#222222',
        },
        neon: {
          blue: '#00f5ff',
          green: '#39ff14',
          red: '#ff0033',
          purple: '#9d4edd',
        }
      },
    },
  },
  plugins: [],
}