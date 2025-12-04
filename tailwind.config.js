/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './src/**/*.{js,jsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{js,jsx}',
    './styles/**/*.css'
  ],
  safelist: [
    'pl-0',
    'pl-1',
    'pl-2',
    'pl-3',
    'pl-4',
    'pl-5',
    'pl-6',
    'pl-7',
    'pl-8',
    'pl-9',
    'pl-10'
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          1: '#005FEE',
          2: '#1F5EE2'
        },
        dark: {
          1: '#242472',
          2: '#1E1E59'
        },
        pink: '#FF00B8',
        indigo: '#6928FA',
        gray: {
          1: '#F4F8FB',
          2: '#CCC'
        },
        red: '#ed6a5a',
        white: '#fff',
        black: '#000'
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        hind: ['Hind', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.hero-gradient': {
          background:
            'linear-gradient(240.65deg, #85A2FF 23.88%, #2B4DFF 59.37%)'
        }
      })
    })
  ]
}
