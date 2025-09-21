/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4f46e5',  // Indigo
        'brand-secondary': '#e0e7ff',
        'brand-accent': '#ec4899',
        'brand-dark': '#111827',
      },
    },
  },
  plugins: [],
}
