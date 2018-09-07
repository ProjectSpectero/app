const path = require('path')
const BourbonNeat = require('bourbon-neat').includePaths[0]

module.exports = {
  filenameHashing: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/shared/assets'),
        '@styles': path.resolve(__dirname, './src/shared/assets/styles'),
        '@img': path.resolve(__dirname, './src/shared/assets/img'),
        '@fonts': path.resolve(__dirname, './src/shared/assets/fonts'),
        '@neat': BourbonNeat
      }
    }
  },
  chainWebpack: config => {
    const hash = (process.env.VUE_APP_HASH_BUNDLE && process.env.VUE_APP_HASH_BUNDLE === 'true')
    config.output.filename(
      (process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD)
        ? (hash ? '[name]-legacy.[hash:8].js' : '[name]-legacy.js')
        : (hash ? '[name].[hash:8].js' : '[name].js'))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/shared/assets/styles/vars/_all.scss')
      ]
    }
  }
}
