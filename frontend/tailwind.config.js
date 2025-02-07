/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        neon: 'neon 3s linear infinite',
        shine: 'shine 5s linear infinite',
      },
      keyframes: {
        neon: {
          '0%': { transform: 'translate(-100%, -100%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 100%)', opacity: '0.7' },
        },
        shine : {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },  
      },
    },
  },
  plugins: [],
}