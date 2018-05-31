const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APP_ENDPOINT: '"dev.spectero.com"',
  APP_HTTPS: true,
  APP_PORT: '""',
  APP_VERSION: '"v1"',
  APP_COOKIE: '"SPECTERO_APP_AUTH"',
  DAEMON_COOKIE: '"SPECTERO_DAEMON_AUTH"',
  DOWNLOAD_LINK_LINUX: '"https://git.io/whatever"',
  DOWNLOAD_LINK_MACOS: '"https://git.io/whatevermac"',
  DOWNLOAD_LINK_WINDOWS: '"https://git.io/whateverwin"'
})
