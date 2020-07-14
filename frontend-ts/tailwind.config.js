module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.jsx',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      margin: {
        '1.5': '0.375rem'
      },
      lineHeight: {
        'tighter': '1.125'
      }
    }
  },
  variants: {},
  plugins: [],
}
