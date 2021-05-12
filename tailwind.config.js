module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      padding: ['responsive', 'hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
