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
        store.dispatch('auth/addCookie', result).then(() => {
          // Add tokens to the store
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
    console.log('error was ', error)
    return options.loginFailed(error)
  })
}

export default {
  login
}
