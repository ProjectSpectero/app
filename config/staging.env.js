const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const config = require('dotenv').config()
const dotenvVars = {}

if (config.parsed !== undefined) {
  for (let key in config.parsed) {
    dotenvVars[key] = JSON.stringify(config.parsed[key])
  }
}

module.exports = merge(prodEnv, dotenvVars, {
  NODE_ENV: '"staging"',
  APP_ENDPOINT: '"dev.spectero.com"',
  APP_HTTPS: true,
  APP_PORT: '""',
  APP_VERSION: '"v1"',
  APP_COOKIE: '"SPECTERO_APP_AUTH"',
  DAEMON_COOKIE: '"SPECTERO_DAEMON_AUTH"',
  IMPERSONATE_COOKIE: '"SPECTERO_APP_IMPERSONATE"'
})
