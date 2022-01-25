import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  extract: {
    include: ['**/*.{jsx,css,scss}'],
    exclude: ['node_modules', '.git', '.next/**/*']
  },
  theme: {
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
      hind: ['Hind', 'sans-serif'],
    },
  },
  attributify: true,
  plugins: [
    require('windicss/plugin/forms'),
    require('windicss/plugin/aspect-ratio'),
    require('windicss/plugin/line-clamp'),
    require('windicss/plugin/typography'),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.btn-gradient': {
          backgroundImage: 'linear-gradient(141.3deg, #FF00B8 14.53%, #326CE5 129.58%)'
        },
        '.hero-gradient': {
          backgroundImage: 'linear-gradient(240.65deg, #85A2FF 23.88%, #2B4DFF 59.37%)'
        }
      }
      addUtilities(newUtilities)
    })
  ]
})
