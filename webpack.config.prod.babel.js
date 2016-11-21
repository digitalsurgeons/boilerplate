import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompilerPlugin from 'compiler-webpack-plugin'
import autoprefixer from 'autoprefixer'
import postcssRemify from 'postcss-remify'
import postcssEmify from 'postcss-emify'
import path from 'path'
import webpack from 'webpack'
import { exec } from 'child_process'
import vendor from './js/vendor'

const paths = {
  dist: 'public_html/dist/',
  publicPath: 'public_html/'
}

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
    filename: `${paths.dist}[name].js`
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
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: `file-loader?name=${paths.publicPath}[path]/[name].[ext]`,
        include: path.join(__dirname, 'img')
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: `file-loader?name=${paths.publicPath}[path]/[name].[ext]`,
        include: path.join(__dirname, paths.publicPath + 'fonts')
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
    new ExtractTextPlugin(`${paths.dist}[name].css`, { allChunks: false }),
    new CleanWebpackPlugin([path.join(__dirname, paths.dist)], {
      root: process.cwd()
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'vendor',
        'svgxuse'
      ],
      children: true // (select all children of chosen chunks)
    }),
    new CompilerPlugin('compilation', function () {
      // Generate sprite
      exec(`npm run sprite`)
    })
  ]
}
