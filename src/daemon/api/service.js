import api from './index.js'

export default {
  /**
   * List services and statuses.
   */
  list (options) {
    return api('GET', `/service`, options)
  },

  /**
   * List ip addresses.
   */
  ips (options) {
    return api('GET', `/service/ips`, options)
  },

  /**
   * View service config for a given service name.
   *
   * @param {String} name Service name to query.
   */
  get (options) {
    return api('GET', `/service/${options.name}/config`, options)
  },

  /**
   * Update service config for a given service name.
   *
   * @param {String} name Service name to query.
   *
   * @param {Array}  listeners
   * @param {Array}  allowedDomains
   * @param {Array}  bannedDomains
   * @param {String} proxyMode
   */
  update (options) {
    return api('PUT', `/service/${options.name}/config`, options)
  },

  /**
   * Manage service
   *
   * @param {String} name   Service name to query.
   * @param {String} action Action to perform to service (action name).
   */
  manage (options) {
    return api('GET', `/service/${options.name}/${options.action}`, options)
  }
}
