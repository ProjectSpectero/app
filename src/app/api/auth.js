import api from './index'
import store from '@/store'

export default {
  /**
   * Authenticates user with credentials.
   *
   * @param {String} authKey  Username or email for user to authenticate.
   * @param {String} password Password for user to authenticate.
   */
  login (options) {
    return api('POST', '/auth', options, response => {
      if (response && response.data) {
        // Login successful, token issued
        if (response.data.message === 'OAUTH_TOKEN_ISSUED') {
          const result = response.data.result

          // Bind cookie
          store.dispatch('appAuth/addCookie', result).then(() => {
            // Add tokens to the store
            store.dispatch('appAuth/setLoginInfo', result).then(() => {
              return options.loginSuccess()
            })
          })
        }
      }

      // 200 status code recieved, but token wasn't issued
      return options.loginFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
    }, error => {
      return options.loginFailed((error !== undefined) ? error : 'Unknown error occurred.')
    })
  },

  register (options) {
    return api('POST', '/user', options, response => {
      if (response && response.data) {
        return options.registerSuccess(response.data.result)
      }

      // 200 status code recieved, but token wasn't issued
      return options.registerFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
    }, error => {
      return options.registerFailed((error !== undefined) ? error : 'Unknown error occurred.')
    })
  },

  registerEasy (options) {
    return api('POST', '/user/easy', options, response => {
      if (response && response.data) {
        const result = response.data.result
        const auth = result.auth

        const loginData = {
          accessToken: auth.token,
          expiry: auth.expires
        }

        store.dispatch('appAuth/addCookie', loginData).then(() => {
          // Add tokens to the store
          store.dispatch('appAuth/setLoginInfo', loginData).then(() => {
            return options.registerSuccess(result)
          })
        })

        // return options.registerSuccess(result)
      }

      // 200 status code recieved, but token wasn't issued
      return options.registerFailed('Unknown error occurred: 200 status code recieved, but token failed to be issued.')
    }, error => {
      return options.registerFailed((error !== undefined) ? error : 'Unknown error occurred.')
    })
  },

  /**
   * Requests a password reset.
   *
   * @param {String} email  The user's email.
   */
  askForPasswordReset (options) {
    return api('POST', '/password-reset', options)
  },

  /**
   * Validates the password reset.
   *
   * @param {String} email  The user's email.
   */
  validatePasswordReset (options) {
    return api('GET', `/password-reset/${options.data.token}`, options)
  },

  /**
   * Impersonate a user at given id.
   *
   * @param {Integer} id User id to delete.
   */
  impersonate (options) {
    return api('POST', `/auth/impersonate/${options.data.id}`, options)
  }
}
