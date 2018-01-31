import api from './index.js'
import store from '@/store'
import { getCookie, removeCookie } from 'tiny-cookie'

/**
 * Returns parsed token from SPECTERO_AUTH cookie.
 *
 * On error, returns Object with error key and deletes cookie (if any).
 *
 * @param {String} token Token to validate (uses auth cookie if null)
 */
const parseToken = function (token) {
  try {
    return {
      token: token || getCookie('SPECTERO_AUTH'),
      exp: null,
      data: null,
      error: null
    }
  } catch (err) {
    removeCookie('SPECTERO_AUTH')
    return { error: err }
  }
}

/**
 * Verifies current token in cookies and user object in vuex store.
 */
const checkLogin = function () {
  const token = parseToken()
  return token.error !== null ? false : token
}

/**
 * Authenticates user with credentials.
 *
 * @param {String} authKey  Username or email for user to authenticate.
 * @param {String} password Password for user to authenticate.
 */
const login = function (options) {
  return api('POST', '/auth', options, response => {
    if (response && response.data) {
      // Login successful, token issued
      if (response.data.message === 'OAUTH_TOKEN_ISSUED') {
        const result = response.data.result

        // Bind cookie and set tokens within the store
        store.dispatch('auth/addCookie', result).then(() => {
          console.log('Added cookie with', getCookie('SPECTERO_AUTH'))
          store.dispatch('auth/setLoginInfo', result).then(() => {
            options.loginSuccess()
          })
        })
      }
    }

    // 200 status code recieved, but token wasn't issued
    return options.loginFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
  }, error => {
    if (error === undefined) {
      return options.loginFailed('Unknown error occurred.')
    }
    return options.loginFailed(error)
  })
}

export default {
  parseToken,
  checkLogin,
  login
}
