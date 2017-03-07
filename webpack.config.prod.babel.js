import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompilerPlugin from 'compiler-webpack-plugin'
import postcssRemify from 'postcss-remify'
import postcssEmify from 'postcss-emify'
import postcssImport from 'postcss-import'
import cssNext from 'postcss-cssnext'
import path from 'path'
import webpack from 'webpack'
import { exec } from 'child_process'
import vendor from './js/vendor'
import config from './config'

export default {
  entry: {
    bundle: './js/app.js',
    style: './scss/app.scss',
    svgxuse: './node_modules/svgxuse/svgxuse.js',
    vendor: vendor
  },
  output: {
    publicPath: '/',
    path: __dirname,
    filename: `${config.paths.dist}[name].js`
  },
  stats: {
    children: false
  },
  module: {
    loaders: [
      // Extract css files
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      },
      // Load SCSS
      {
        test: /\.scss/,
        loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader', { allChunks: true }),
        include: path.join(__dirname, 'scss')
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: `file-loader?name=${config.paths.publicPath}img/[name].[ext]`,
        include: path.join(__dirname, `${config.paths.publicPath}img`)
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: `file-loader?name=${config.paths.publicPath}fonts/[name].[ext]`,
        include: path.join(__dirname, `${config.paths.publicPath}fonts`)
      }
    ]
  },
  postcss: function () {
    return [
      postcssRemify,
      postcssEmify,
      postcssImport,
      cssNext
    ]
  },
  plugins: [
    new ExtractTextPlugin(`${config.paths.dist}[name].css`, { allChunks: false }),
    new CleanWebpackPlugin([path.join(__dirname, config.paths.dist)], {
      root: process.cwd()
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new CompilerPlugin('done', function () {
      // Generate sprite
      exec(`./node_modules/.bin/svg-sprite-generate -d ${config.paths.publicPath}icons -o ${config.paths.dist}symbol-defs.svg`)
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
