const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env)
const loadPresets = require('./build-utils/loadPresets')

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) =>
  webpackMerge(
    {
      mode,
      entry: './js/app.js',
      plugins: [
        new HtmlWebpackPlugin({
          template: 'public_html/index.html',
          filename: '../index.html'
        }),
        new webpack.ProgressPlugin()
      ]
    },
    modeConfig(mode),
    loadPresets({ mode, presets })
  )
