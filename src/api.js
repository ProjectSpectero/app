import Vue from 'vue'
import axios from 'axios'
import { getCookie, removeCookie } from 'tiny-cookie'
import Err from '@/error'
import router from '@/router'

/**
 * API wrapper for making various calls from sub-wrappers.
 *
 * @param {String}   method  HTTP method (ie: GET, POST, PUT, DELETE)
 * @param {String}   path    API endpoint path
 * @param {Object}   data    Form data for submit
 * @param {Function} success Callback to be called on method success
 * @param {Function} failed  Callback to be called on method fail
 */
async function API (project, method, path, data, success, failed) {
  // Setting up the proper axios path for deamon interaction works as follows:
  // 1) If you specify daemon params on the config build file, those will be used across the app
  // 2) If you don't specify certain (or all) params, defaults will kick in.
  //    This means url will be derived from where we're at, protocol too. However, port is a bit different:
  // 2.1) If no port is specified, defaults to the current url port (8080, etc.)
  // 2.2) If a port is specified on our config BUT that port is '', we'll run the app using only the ip address
  // 2.3) If a port is specified and numeric, that will be used as expected

  const cookieName = process.env[project + '_COOKIE']
  const cookie = (getCookie(cookieName) !== null) ? JSON.parse(getCookie(cookieName)) : null
  const protocol = process.env[project + '_HTTPS'] ? 'https://' : location.protocol + '//'
  let port = location.port ? ':' + location.port : ''
  const endpoint = process.env[project + '_ENDPOINT'] ? process.env[project + '_ENDPOINT'] : location.hostname

  // Allowing a default empty port to be specified
  if (process.env[project + '_PORT'] !== undefined) {
    port = process.env[project + '_PORT'] ? ':' + process.env[project + '_PORT'] : ''
  }

  Vue.prototype.$Progress.start()

  try {
    const response = await axios({
      method: method,
      baseURL: protocol + endpoint + port + '/v' + process.env[project + '_VERSION'],
      timeout: 10000,
      headers: {
        Authorization: cookie ? `Bearer ${cookie.accessToken}` : null
      },
      url: path,
      data: data.data
    })

    if (response) {
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
    }
  } catch (e) {
    Vue.prototype.$Progress.finish()

    let error = e.response

    // Remove authorization cookie if 401 returned by any API call.
    if (error.status === 401 && getCookie(cookieName) !== null) {
      removeCookie(cookieName)

      // Force the user to the login page with or without a redirect route param
      if (router.history.current.name) {
        router.push({ name: 'login', query: { redirect: router.history.current.name } })
      } else {
        router.push({ name: 'login' })
      }
    }

    let err = new Err(error.data.errors)

    // Main api callback
    if (typeof failed === 'function') {
      failed(err)
    }

    // Sub-wrapper callback
    if (typeof data.fail === 'function') {
      data.fail(err)
    }

    return { error: true, data: err }
  }
}

export default API
