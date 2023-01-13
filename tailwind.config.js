/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'green': '#1DB954',
        'red': '#DC2626',
      },
      backgroundColor: {
        'main': '#181818',
        'nav': '#121212',
        'block': '#282828',
        'light': '#383838'
      }
    }
  },
  plugins: [],
  variants: {
    extend: {
      textColor: ['active'],
      backgroundColor: ['hover'],
    }
  },
  purge: {
    enabled: false,
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}']
  }
}
