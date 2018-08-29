import { getCookie, removeCookie } from 'tiny-cookie'
import router from '@/router'

class ErrorHandler {
  constructor (project, data, status) {
    this.project = project
    this.status = status

    this.parse(data)
  }

  /**
   * Parser for error data returned from API.
   *
   * Used to parse error fields, for instance: `FIELD_MAXLENGTH:authKey:50` decodes to
   * a FIELD_MAXLENGTH error on the authKey field, with a max allowed length of 50.
   *
   * Note: error keys may contain more than one error, this function will return an array
   * of keys, with an array of error fields (if any) within each key.
   *
   * @param {String} data Data string from error passed from API.
   */
  parse (data) {
    let errors = {}
    let fields = {}

    // Data is Array[] of error keys (keys w/ no additional data)
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i] === 'object') {
          errors[i] = data[i]
        } else {
          errors[data[i]] = {}
        }
      }
    } else {
      // Data is Object{} with keys as error keys, values as additional info to those error keys
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          let err = []

          for (let i = 0; i < data[key].length; i++) {
            let e = data[key][i].split(':')

            err.push({
              key: e[0],
              field: e[1],
              data: e[2]
            })

            if (e[1] !== undefined) {
              if (fields[e[1]] === undefined) {
                fields[e[1]] = {}
              }
              fields[e[1]][e[0]] = e[2] !== undefined ? e[2] : null
            }
          }
          errors[key] = err
        }
      }
    }

    this.errors = errors
    this.fields = fields
  }

  handleStatus () {
    if (this.status === 401 && getCookie(this.project.cookieName) !== null) {
      removeCookie(this.project.cookieName)
      router.push({ name: 'login', query: { redirect: location.pathname + location.search } })
    } else if (this.status === 404) {
      router.push({ path: '/404' })
    } else if ([400, 500].includes(this.status)) {
      router.push({ name: 'generic-error' })
    }
  }
}

export default ErrorHandler
