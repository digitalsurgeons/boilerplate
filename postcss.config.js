const atImport = require('postcss-easy-import')

module.exports = {
  plugins: [
    atImport({
      plugins: [require('stylelint')]
    }),
    require('postcss-preset-env')({
      autoprefixer: { grid: true },
      features: {
        'nesting-rules': true
      }
    })
  ]
}
