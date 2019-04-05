const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompilerPlugin = require('compiler-webpack-plugin')
const path = require('path')
const glob = require('glob')
const child_process = require('child_process')
const config = require('./config')

const websiteBundle = glob.sync('./components/website/**/*.js')
const uiBundle = glob.sync('./components/ui/**/*.js')
const sharedBundle = glob.sync('./components/shared/**/*.js')
const vendor = require('./js/vendor')

module.exports = {
  entry: {
    websitebundle: websiteBundle,
    uibundle: uiBundle,
    sharedbundle: sharedBundle,

    websitestyles: './css/website.pcss',
    uistyles: './css/ui.pcss',
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
        test: /\.pcss$/,
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
    new CleanWebpackPlugin([path.join(__dirname, config.paths.dist)], {
      root: process.cwd()
    }),
    new CompilerPlugin('done', function() {
      child_process.exec(
        `./node_modules/.bin/svg-sprite-generate -d ${
          config.paths.publicPath
        }icons -o ${config.paths.dist}symbol-defs.svg`
      )
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
