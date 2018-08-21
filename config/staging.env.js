// Configuration for staging.spectero.com

const merge = require('webpack-merge')
const config = require('dotenv').config()
const dotenvVars = {}

if (config.parsed !== undefined) {
  for (let key in config.parsed) {
    dotenvVars[key] = JSON.stringify(config.parsed[key])
  }
}

module.exports = merge(dotenvVars, {
  NODE_ENV: JSON.stringify('staging'),
  APP_ENDPOINT: JSON.stringify('app.spectero.com'),
  APP_PROTOCOL: JSON.stringify('https'),
  APP_VERSION: JSON.stringify('v1'),
  APP_PORT: JSON.stringify('null'),
  APP_COOKIE: JSON.stringify('SPECTERO_APP_AUTH'),
  DAEMON_COOKIE: JSON.stringify('SPECTERO_DAEMON_AUTH'),
  IMPERSONATE_COOKIE: JSON.stringify('SPECTERO_APP_IMPERSONATE')
})
