/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'qlu': '#1a2c80',
        'qlublue': '#105397'
      }
    }
  },
  plugins: [
    forms,
  ],
}
