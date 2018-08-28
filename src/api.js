import Vue from 'vue'
import axios from 'axios'
import { getCookie, removeCookie } from 'tiny-cookie'
import router from '@/router'
import Err from '@/error'

/**
 * API wrapper for making various calls from sub-wrappers.
 *
 * @param {String}   method  HTTP method (ie: GET, POST, PUT, DELETE)
 * @param {String}   path    API endpoint path
 * @param {Object}   data    Form data for submit
 * @param {Function} success Callback to be called on method success
 * @param {Function} fail  Callback to be called on method fail
 */
async function API (project, method, path, data, success, fail) {
  let instance = axios.create({})
  const baseURL = project.protocol + project.endpoint + project.port + '/' + project.version
  const progress = Vue.prototype.$Progress
  let headers = {
    Authorization: project.cookie ? `Bearer ${project.cookie.accessToken}` : null
  }

  if (data.headers) {
    headers = {...headers, ...data.headers}
  }

  instance.interceptors.request.use(config => {
    progress.start()
    return config
  }, error => {
    return Promise.reject(error)
  })

  instance.interceptors.response.use(
    async response => {
      if (response.data.result) {
        console.warn('Response data will be', response.data.result)

        if (typeof success === 'function') {
          // console.warn('success(): sending data.result', response.data.result)
          await success(response)
        } else if (typeof data.success === 'function') {
          // console.warn('data.success(): sending data.result', response.data.result)
          await data.success(response)
        }

        progress.finish()
        return { error: false, data: response.data }
      }

      return response
    },
    async e => {
      const errors = (e.response !== undefined && e.response.data !== undefined && e.response.data.errors !== undefined) ? e.response.data.errors : null
      const status = (e.response !== undefined && e.response.status !== undefined) ? e.response.status : null
      const err = new Err(errors, status)

      console.error('Interceptor caught an error', err)

      if (status === 401 && getCookie(project.cookieName) !== null) {
        removeCookie(project.cookieName)
        router.push({ name: 'login', query: { redirect: location.pathname + location.search } })
      }

      // Main api callback
      if (typeof fail === 'function') {
        await fail(err)
      }

      // Sub-wrapper callback
      if (typeof data.fail === 'function') {
        await data.fail(err)
      }

      progress.fail()

      return { error: true, data: err, status: status }
    }
  )

  await instance({
    baseURL: baseURL,
    timeout: project.timeout,
    headers: headers,
    method: method,
    url: path,
    data: data.data,
    params: {}
  })
}

export default API
