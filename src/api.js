import Vue from 'vue'
import axios from 'axios'
import ErrorHandler from '@/error'

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

  // Request interceptors (handle what happens BEFORE connecting to the API)
  instance.interceptors.request.use(config => {
    progress.start()
    return config
  }, error => {
    progress.finish()
    return Promise.reject(error)
  })

  // Response interceptors (handle what happens AFTER connecting to the API)
  instance.interceptors.response.use(
    async response => {
      console.log('Response is', response)
      if (response.data) {
        // Call either the success() or data.success() callbacks
        if (typeof success === 'function') {
          await success(response)
        } else if (typeof data.success === 'function') {
          await data.success(response)
        }

        progress.finish()
        return { error: false, data: response.data }
      }

      progress.finish()
      return response
    },
    async e => {
      const errors = (e.response && e.response.data !== undefined && e.response.data.errors !== undefined) ? e.response.data.errors : null
      const status = (e.response && e.response.status !== undefined) ? e.response.status : null
      const err = new ErrorHandler(project, errors, status)

      console.error('%c💥 API ERROR (' + new Date().toLocaleString() + ') 💥', 'font-weight:bold')
      console.error(err)

      // Call either the fail() or data.fail() callbacks
      if (typeof fail === 'function') {
        await fail(err)
      } else if (typeof data.fail === 'function') {
        await data.fail(err)
      }

      err.handleStatus()

      progress.fail()
      return { error: true, data: err, status: status }
    }
  )

  // Using a custom axios instance allows us to use axios in other contexts
  // (outside of the API and without interceptors)
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
