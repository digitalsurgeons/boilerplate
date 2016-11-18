const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompilerPlugin = require('compiler-webpack-plugin')
const autoprefixer = require('autoprefixer')
const postcssRemify = require('postcss-remify')
const postcssEmify = require('postcss-emify')
const path = require('path')
const webpack = require('webpack')
const exec = require('child_process').exec
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
    path: __dirname,
    filename: 'public_html/dist/[name].js'
  },
  stats: {
    children: false
  },
  module: {
    loaders: [
      // Extract css files
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      // Load SCSS
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader', { allChunks: true }),
        include: path.join(__dirname, 'scss')
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader?name=public_html/dist/[path]/[name].[ext]',
        include: path.join(__dirname, 'img')
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public_html/dist/[path]/[name].[ext]',
        include: path.join(__dirname, 'public_html/dist/fonts')
      }
    ]
  },
  postcss: function () {
    return [
      autoprefixer,
      postcssRemify,
      postcssEmify
    ]
  },
  plugins: [
    // Copy all assets to dist folder
    new CopyWebpackPlugin([
      { from: 'img', to: 'public_html/dist/img' },
      { from: 'icons', to: 'public_html/dist/icons' },
      { from: 'fonts', to: 'public_html/dist/fonts' }
    ]),
    new ExtractTextPlugin('./public_html/dist/[name].css', { allChunks: false }),
    new CleanWebpackPlugin([path.join(__dirname, 'public_html/dist')], {
      root: process.cwd()
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new WebpackNotifierPlugin({ title: 'Webpack', contentImage: path.join(__dirname, 'Areas/CamelBak/Assets/img/logo.png') }),
    new CompilerPlugin('done', function () {
      // Generate sprite
      exec('./node_modules/.bin/svg-sprite-generate -d icons -o public_html/dist/symbol-defs.svg')
    })
  ]
}
