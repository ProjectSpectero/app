const path = require('path')
const BourbonNeat = require('bourbon-neat').includePaths[0]
const isLegacyBundle = (process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD)

module.exports = {
  filenameHashing: true,
  configureWebpack: {
    output: {
      filename: isLegacyBundle ? 'spectero-legacy.[hash:8].js' : 'spectero.[hash:8].js'
    },
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
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/shared/assets/styles/vars/_all.scss')
      ]
    }
  }
}
