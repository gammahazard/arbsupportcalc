/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        team1: '#22c55e', // Green
        team2: '#3b82f6', // Blue
        background: '#0a0a0a',
        'card-bg': '#1a1a1a',
        'input-bg': '#262626',
      },
      borderColor: {
        DEFAULT: '#333333',
      },
    },
  },
  plugins: [],
}