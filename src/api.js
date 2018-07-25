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
  const baseURL = project.protocol + project.endpoint + project.port + '/' + project.version

  Vue.prototype.$Progress.start()

  try {
    const response = await axios({
      method: method,
      baseURL: baseURL,
      timeout: project.timeout,
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
    console.error('API handling failed!', e)
    const errors = (e.response !== undefined && e.response.data !== undefined && e.response.data.errors !== undefined) ? e.response.data.errors : null
    const status = (e.response !== undefined && e.response.status !== undefined) ? e.response.status : null
    const err = new Err(errors, status)

    // Gracefully handling timeout errors
    if (e.code === 'ECONNABORTED') {
      const str = (process.env.NODE_ENV !== 'production') ? 'Connection to ' + baseURL + path + ' timed out!' : 'Connection timed out!'

      Vue.prototype.$Progress.fail()
      Vue.toasted.error(str)

      if (failed !== undefined && typeof failed === 'function') {
        failed(err, 598)
      } else {
        data.fail(err)
      }

      router.go(-2)
      return
    }

    // Remove authorization cookie if 401 (unauthorized) or 403 (email verification needed is returned by any API call
    if ([401, 403].includes(status) && getCookie(project.cookieName) !== null) {
      removeCookie(project.cookieName)
      router.push({ name: 'login', query: { redirect: location.pathname + location.search } })
    }

    // Main api callback
    if (typeof failed === 'function') {
      failed(err)
    }

    // Sub-wrapper callback
    if (data !== undefined && typeof data.fail === 'function') {
      data.fail(err)
    }

    Vue.prototype.$Progress.fail()

    return { error: true, data: err, status: status }
  }
}

export default API
