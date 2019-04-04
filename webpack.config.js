const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const WebpackNotifierPlugin = require('webpack-notifier')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompilerPlugin = require('compiler-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const Dotenv = new (require('dotenv-webpack'))()
const path = require('path')
const glob = require('glob')
const child_process = require('child_process')
const config = require('./config')
const vendor = require('./js/vendor')

let localEnv = Dotenv.definitions['process.env.LOCAL_URL']
localEnv = localEnv.substring(1, localEnv.length - 1)

const websiteBundle = glob.sync('./components/website/**/index.js')
const uiBundle = glob.sync('./components/ui/**/index.js')
const sharedBundle = glob.sync('./components/shared/**/index.js')

const websiteStyles = glob.sync('./components')

module.exports = {
  entry: {
    bundle: jsGlob,
    style: './css/app.css',
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
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ])
      },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        proxy: process.env.SITE || localEnv || 'http://0.0.0.0:8080',
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
        `onchange '${
          config.paths.publicPath
        }icons' -i -- ./node_modules/.bin/svg-sprite-generate -d ${
          config.paths.publicPath
        }icons -o ${config.paths.dist}symbol-defs.svg`
      )
    })
  ]
}
