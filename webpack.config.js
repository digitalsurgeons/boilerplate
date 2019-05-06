const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env)
const loadPresets = require('./build-utils/loadPresets')

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) =>
  webpackMerge(
    {
      mode,
      plugins: [new webpack.ProgressPlugin()],
      module: {
        rules: [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              'style-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: mode === 'development'
                }
              },
              'css-loader',
              'postcss-loader'
            ]
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    },
    modeConfig(mode),
    loadPresets({ mode, presets })
  )

// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const webpack = require('webpack')
// const WebpackNotifierPlugin = require('webpack-notifier')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CompilerPlugin = require('compiler-webpack-plugin')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
// const Dotenv = new (require('dotenv-webpack'))()
// const path = require('path')
// const glob = require('glob')
// const child_process = require('child_process')
// const config = require('./config')

// let localEnv = Dotenv.definitions['process.env.LOCAL_URL']
// localEnv = localEnv.substring(1, localEnv.length - 1)

// const websiteBundle = glob.sync('./components/website/**/*.js')
// const uiBundle = glob.sync('./components/ui/**/*.js')
// const sharedBundle = glob.sync('./components/shared/**/*.js')
// const vendor = require('./js/vendor')

// module.exports = {
//   entry: {
//     websitebundle: websiteBundle,
//     uibundle: uiBundle,
//     sharedbundle: sharedBundle,
//     vendor: vendor,

//     websitestyles: './css/website.css',
//     uistyles: './css/ui.css',
//     svgxuse: './node_modules/svgxuse/svgxuse.js'
//   },
//   output: {
//     publicPath: '/',
//     path: path.resolve(__dirname, config.paths.dist),
//     filename: '[name].js'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         exclude: /node_modules/,
//         use: ExtractTextPlugin.extract([
//           {
//             loader: 'css-loader',
//             options: { importLoaders: 1 }
//           },
//           'postcss-loader'
//         ])
//       },
//       { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
//     ]
//   },
//   plugins: [
//     new ExtractTextPlugin('[name].css'),
//     new webpack.optimize.CommonsChunkPlugin({
//       name: 'vendor'
//     }),
//     new BrowserSyncPlugin(
//       {
//         host: 'localhost',
//         proxy: process.env.SITE || localEnv || 'http://0.0.0.0:8080',
//         port: 3000,
//         files: ['public_html/dist/*.css']
//       },
//       {
//         reload: false
//       }
//     ),
//     new CleanWebpackPlugin([path.join(__dirname, config.paths.dist)], {
//       root: process.cwd()
//     }),
//     new WebpackNotifierPlugin({
//       title: 'Webpack',
//       contentImage: path.join(
//         __dirname,
//         `${config.paths.publicPath}img/ds-logo.jpg`
//       )
//     }),
//     new CompilerPlugin('done', function() {
//       child_process.exec(
//         `onchange '${
//           config.paths.publicPath
//         }icons' -i -- ./node_modules/.bin/svg-sprite-generate -d ${
//           config.paths.publicPath
//         }icons -o ${config.paths.dist}symbol-defs.svg`
//       )
//     })
//   ]
// }
