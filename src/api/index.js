import Vue from 'vue'
import axios from 'axios'
import { getCookie, removeCookie } from 'tiny-cookie'
import Err from '../modules/error.js'

/**
 * API wrapper for making various calls from sub-wrappers.
 *
 * @param {String}   method  HTTP method (ie: GET, POST, PUT, DELETE)
 * @param {String}   path    API endpoint path
 * @param {Object}   data    Form data for submit
 * @param {Function} success Callback to be called on method success
 * @param {Function} failed  Callback to be called on method fail
 */
export default function (method, path, data, success, failed) {
  // Setting up the proper axios path for deamon interaction works as follows:
  // 1) If you specify daemon params on the config build file, those will be used across the app
  // 2) If you don't specify certain (or all) params, defaults will kick in.
  //    This means url will be derived from where we're at, protocol too. However, port is a bit different:
  // 2.1) If no port is specified, defaults to the current url port (8080, etc.)
  // 2.2) If a port is specified on our config BUT that port is '', we'll run the app using only the ip address
  // 2.3) If a port is specified and numeric, that will be used as expected

  const protocol = process.env.DAEMON_HTTPS ? 'https://' : location.protocol + '//'
  const endpoint = process.env.DAEMON_ENDPOINT ? process.env.DAEMON_ENDPOINT : location.hostname
  const version = process.env.DAEMON_VERSION
  let port = location.port ? ':' + location.port : ''

  // Allowing a default empty port to be specified
  if (process.env.DAEMON_PORT !== undefined) {
    port = process.env.DAEMON_PORT ? ':' + process.env.DAEMON_PORT : ''
  }

  const url = protocol + endpoint + port + '/v' + version

  Vue.prototype.$Progress.start()

  axios({
    method: method,
    baseURL: url,
    timeout: 10000,
    headers: {
      Authorization: getCookie('SPECTERO_AUTH') !== null ? `Bearer ${getCookie('SPECTERO_AUTH')}` : null
    },
    url: path,
    data: data.data
  }).then(response => {
    Vue.prototype.$Progress.finish()

    // Main api callback
    if (typeof success === 'function') {
      success(response)
    }

    // Sub-wrapper callback
    if (typeof data.success === 'function') {
      data.success(response)
    }

    return { error: false, data: response }
  }).catch(error => {
    Vue.prototype.$Progress.finish()

    console.log(error)
    error = error.response

    // Remove authorization cookie if 401 returned by any API call
    if (error.status === 401 && getCookie('SPECTERO_AUTH') !== null) {
      removeCookie('SPECTERO_AUTH')
    }

    let err = new Err(error.data.errors)

    if (typeof failed === 'function') { // Main api callback
      failed(err)
    }
    if (typeof data.fail === 'function') { // Sub-wrapper callback
      data.fail(err)
    }

    return { error: true, data: err }
  })
}
