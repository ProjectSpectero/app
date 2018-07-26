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
   * Creates user from given parameters.
   *
   * @param {String} authKey      Username.
   * @param {String} password     Password.
   * @param {String} emailAddress Email address.
   * @param {String} fullName     Display name.
   * @param {Array}  roles        Array of roles to assign ([] for no roles).
   * @param {String} cert         n/a
   * @param {String} cartKey      n/a
   */
  create (options) {
    return api('POST', `/user`, options)
  },

  /**
   * Edit a users details.
   *
   * @param {Integer} id       User id to edit.
   *
   * @param {String} authKey      Username.
   * @param {String} password     Password.
   * @param {String} emailAddress Email address.
   * @param {String} fullName     Display name.
   * @param {Array}  roles        Array of roles to assign ([] for no roles).
   * @param {String} cert         n/a
   * @param {String} cartKey      n/a
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
   * Returns all services details.
   *
   * @param {Integer} id ID pertaining to user being requested.
   */
  getServices (options) {
    return api('GET', `/user/${options.data.id}/service-resources`, options)
  },

  /**
   * Returns one service details.
   *
   * @param {Integer} id ID pertaining to user being requested.
   * @param {String} service Name of the service we want to fetch info from.
   */
  getService (options) {
    return api('GET', `/user/${options.data.id}/service-resources/${options.data.service}`, options)
  }
}
