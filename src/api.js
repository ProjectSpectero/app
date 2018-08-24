import Vue from 'vue'
import axios from 'axios'
// import { getCookie, removeCookie } from 'tiny-cookie'
// import Err from '@/error'
// import router from '@/router'

/**
 * API wrapper for making various calls from sub-wrappers.
 *
 * @param {String}   method  HTTP method (ie: GET, POST, PUT, DELETE)
 * @param {String}   path    API endpoint path
 * @param {Object}   data    Form data for submit
 * @param {Function} success Callback to be called on method success
 * @param {Function} fail  Callback to be called on method fail
 */
function API (project, method, path, data, success, fail) {
  const baseURL = project.protocol + project.endpoint + project.port + '/' + project.version
  const progress = Vue.prototype.$Progress
  let headers = {
    Authorization: project.cookie ? `Bearer ${project.cookie.accessToken}` : null
  }

  if (data.headers) {
    headers = {...headers, ...data.headers}
  }

  progress.start()

  // https://gist.github.com/moreta/fb2625c59aa788009b1f7ce8e44ac559
  let instance = axios.create({
    baseURL: baseURL,
    timeout: project.timeout,
    headers: headers,
    method: method,
    url: path,
    data: data.data,
    params: {}
  })

  // Handle request (before it is sent)
  instance.interceptors.request.use((config) => {
    console.log('using config', config)
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  // Handle response
  instance.interceptors.response.use((response) => {
    console.log('interceptor response')
    progress.finish()
    success(response)
    return response
  }, (error) => {
    console.log('interceptor error')
    progress.fail()

    if (error.response) {
      console.error(error)
      fail(error.response)
    }
  })

  //   if (response) {
  //     // Main api callback
  //     if (typeof success === 'function') {
  //       success(response)
  //     }

  //     // Sub-wrapper callback
  //     if (typeof data.success === 'function') {
  //       data.success(response)
  //     }

  //     return { error: false, data: response }
  //   }
  // } catch (e) {
  //   console.error('API handling fail!', e)
  //   const errors = (e.response !== undefined && e.response.data !== undefined && e.response.data.errors !== undefined) ? e.response.data.errors : null
  //   const status = (e.response !== undefined && e.response.status !== undefined) ? e.response.status : null
  //   const err = new Err(errors, status)

  //   // Gracefully handling timeout errors
  //   if (e.code === 'ECONNABORTED') {
  //     const str = (process.env.NODE_ENV !== 'production') ? 'Connection to ' + baseURL + path + ' timed out!' : 'Connection timed out!'

  //     Vue.prototype.$Progress.fail()
  //     Vue.toasted.error(str)

  //     if (fail !== undefined && typeof fail === 'function') {
  //       fail(err, 598)
  //     } else {
  //       data.fail(err)
  //     }

  //     router.go(-2)
  //     return
  //   }

  //   // Remove authorization cookie if 401 (unauthorized / email verification needed) is returned by the API call
  //   if (status === 401 && getCookie(project.cookieName) !== null) {
  //     removeCookie(project.cookieName)
  //     router.push({ name: 'login', query: { redirect: location.pathname + location.search } })
  //   }

  //   // Main api callback
  //   if (typeof fail === 'function') {
  //     fail(err)
  //   }

  //   // Sub-wrapper callback
  //   if (data !== undefined && typeof data.fail === 'function') {
  //     data.fail(err)
  //   }

  //   Vue.prototype.$Progress.fail()

  //   return { error: true, data: err, status: status }
  // }
}

export default API
