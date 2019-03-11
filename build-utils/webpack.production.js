module.exports = () => ({
  devtool: 'source-map',
  output: {
    path: __dirname + '/../public_html/dist',
    filename: 'bundle.[hash].js'
  }
})
