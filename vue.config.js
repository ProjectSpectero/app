const path = require('path')
const BourbonNeat = require('bourbon-neat').includePaths[0]

module.exports = {
  filenameHashing: true,
  configureWebpack: {
    output: {
      filename: '[name].[hash:8].js'
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
