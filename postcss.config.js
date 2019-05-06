const atImport = (module.exports = {
  plugins: [
    require("postcss-normalize"),
    require("postcss-easy-import"),
    require("postcss-preset-env")({
      autoprefixer: { grid: true },
      features: {
        "nesting-rules": true
      }
    }),
    require("cssnano")({
      preset: "default"
    })
  ]
});
