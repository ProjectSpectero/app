const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DAEMON_ENDPOINT: '"dev.spectero.com"',
  DAEMON_HTTPS: true,
  DAEMON_PORT: '""',
  DAEMON_VERSION: '"1"'
})
