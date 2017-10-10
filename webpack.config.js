const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const WebpackNotifierPlugin = require('webpack-notifier')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompilerPlugin = require('compiler-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const path = require('path')
const child_process = require('child_process')
const config = require('./config')
const vendor = require('./js/vendor')

module.exports = {
  entry: {
    bundle: './js/app.js',
    style: './scss/app.scss',
    svgxuse: './node_modules/svgxuse/svgxuse.js',
    vendor: vendor
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, config.paths.dist),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        proxy: process.env.SITE || 'http://0.0.0.0:8080',
        port: 3000,
        files: ['public_html/dist/*.css']
      },
      {
        reload: false
      }
    ),
    new CleanWebpackPlugin([path.join(__dirname, config.paths.dist)], {
      root: process.cwd()
    }),
    new WebpackNotifierPlugin({
      title: 'Webpack',
      contentImage: path.join(
        __dirname,
        `${config.paths.publicPath}img/ds-logo.jpg`
      )
    }),
    new CompilerPlugin('done', function() {
      child_process.exec(
        `onchange '${config.paths
          .publicPath}icons' -i -- ./node_modules/.bin/svg-sprite-generate -d ${config
          .paths.publicPath}icons -o ${config.paths.dist}symbol-defs.svg`
      )
    })
  ]
}
