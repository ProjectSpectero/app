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
  Vue.prototype.$Progress.start()

  try {
    const response = await axios({
      method: method,
      baseURL: project.protocol + project.endpoint + project.port + '/' + project.version,
      timeout: 10000,
      headers: {
        Authorization: project.cookie ? `Bearer ${project.cookie.accessToken}` : null
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
    if (error.status === 401 && getCookie(project.cookieName) !== null) {
      removeCookie(project.cookieName)
      router.push({ name: 'login', query: { redirect: location.pathname + location.search } })
    }

    let err = new Err(error.data.errors, error.status)

    // Main api callback
    if (typeof failed === 'function') {
      failed(err)
    }

    // Sub-wrapper callback
    if (typeof data.fail === 'function') {
      data.fail(err)
    }

    return { error: true, data: err, status: error.status }
  }
}

export default API
