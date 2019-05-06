const webpackMerge = require('webpack-merge')

const loadPresets = (env = { presets: [] }) => {
  const presets = process.env.WEBPACK_PRESETS || []

  const mergedPresets = [].concat(...[presets])
  const mergedConfigs = mergedPresets.map(presetName => {
    return require(`./presets/webpack.${presetName}`)(env)
  })

  return webpackMerge({}, ...mergedConfigs)
}

module.exports = loadPresets
