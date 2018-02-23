import api from './index.js'

export default {
  /**
   * List all users.
   */
  list (options) {
    return api('GET', `/user`, options)
  },

  /**
   * Returns one user by user id.
   *
   * @param {Integer} id ID pertaining to user being requested.
   */
  get (options) {
    return api('GET', `/user/${options.data.id}`, options)
  },

  /**
   * Returns the current user.
   */
  getMe (options) {
    return api('GET', '/user/self', options)
  },

  /**
   * Verifies the user account.
   *
   * @param {String} email Email address.
   * @param {String} tolen Unique token.
   */
  verify (options) {
    return api('GET', `/user/verify/${options.data.email}/${options.data.token}`, options)
  },

  /**
   * Enables/disables 2FA.
   *
   * @param {String} action Enable or disable 2FA.
   */
  twoFactorAuth (options) {
    return api('GET', `/auth/multifactor/${options.action}`, options)
  },

  /**
   * Creates user from given parameters.
   *
   * @param {String} password     Password.
   * @param {String} emailAddress Email address.
   */
  create (options) {
    return api('POST', `/user`, options)
  },

  /**
   * Edit a users details.
   *
   * @param {Integer} id       User id to edit.
   *
   * @param {String}   name   Name.
   * @param {String} email    Email.
   */
  edit (options) {
    return api('PUT', `/user/${options.data.id}`, options)
  },

  /**
   * Delete a user at given id.
   *
   * @param {Integer} id User id to delete.
   */
  delete (options) {
    return api('DELETE', `/user/${options.data.id}`, options)
  },

  /**
   * Regenerates the node key for this user.
   */
  regenerateNodeKey (options) {
    return api('PUT', `/user/node_key`, options)
  }
}
