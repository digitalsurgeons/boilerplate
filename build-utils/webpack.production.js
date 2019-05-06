const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => ({
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname) + '/../public_html/dist',
    filename: 'bundle.[hash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ]
})
