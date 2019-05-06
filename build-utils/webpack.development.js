const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => ({
  output: {
    path: path.resolve(__dirname) + '/../public_html/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
})
