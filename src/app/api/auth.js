import api from './index.js'
import store from '@/store'

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

        // Bind cookie
        store.dispatch('appAuth/addCookie', result).then(() => {
          // Add tokens to the store
          store.dispatch('appAuth/setLoginInfo', result).then(() => {
            options.loginSuccess()
          })
        })
      }
    }

    // 200 status code recieved, but token wasn't issued
    return options.loginFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
  }, error => {
    return options.loginFailed((error !== undefined) ? error : 'Unknown error occurred.')
  })
}

const register = function (options) {
  return api('POST', '/user', options, response => {
    if (response && response.data) {
      options.registerSuccess(response.data.result)
    }

    // 200 status code recieved, but token wasn't issued
    return options.registerFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
  }, error => {
    return options.registerFailed((error !== undefined) ? error : 'Unknown error occurred.')
  })
}

export default {
  login,
  register
}
