/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui', '-apple-system', 'Segoe UI', 'Roboto',
          'Inter', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji'
        ],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,.08)',
      },
      borderRadius: {
        '2xl': '1rem', // keep rounded-2xl consistent across components
      },
    },
  },
  plugins: [],
}
