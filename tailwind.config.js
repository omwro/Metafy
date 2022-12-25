/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green': '#1DB954',
      },
      backgroundColor: {
        'main': '#181818',
        'nav': '#121212',
        'block': '#282828',
        'light': '#383838'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  variants: {
    extend: {
      textColor: ['active']
    }
  }
}
