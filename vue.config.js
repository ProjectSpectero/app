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
    const hash = (process.env.HASH_BUNDLE && JSON.stringify(process.env.HASH_BUNDLE) === 'true')
    config.output.filename(
      (process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD)
        ? (hash ? 'spectero-legacy.[hash:8].js' : 'spectero-legacy.js')
        : (hash ? 'spectero.[hash:8].js' : 'spectero.js'))
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
