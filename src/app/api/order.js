import api from './index'
import helpers from './helpers'

export default {
  /**
   * Returns an order.
   * @param {Integer} id Order id.
   */
  order (options) {
    return api('GET', `/order/${options.data.id}`, options)
  },

  /**
   * Verifies an order for purchaseability.
   * Orders may fail the verification if their resources are unavailable or expired.
   *
   * @param {Integer} id Order id.
   */
  verify (options) {
    return api('GET', `/order/${options.data.id}/verify`, options)
  },

  /**
   * "Fixes" an order for purchaseability.
   *
   * @param {Integer} id Order id.
   */
  fix (options) {
    return api('PUT', `/order/${options.data.id}/fix`, options)
  },

  /**
   * Deletes an order.
   *
   * @param {Integer} id Node id to delete.
   */
  delete (options) {
    return api('DELETE', `/order/${options.data.id}`, options)
  },

  /**
   * Returns orders list for the logged in user.
   */
  myOrders (options) {
    return api('GET', helpers.appendQuery(`/order/self`, options.queryParams), options)
  },

  /**
   * Returns orders list for the logged in enterprise user.
   */
  myEnterpriseOrders (options) {
    return api('GET', helpers.appendQuery(`/order/self/enterprise`, options.queryParams), options)
  },

  /**
   * Searches and filters orders. Example rules:
   * "rules": [
   *     {
   *         "field": "status",
   *         "operator": "=",
   *         "value": "ACTIVE"
   *     }
   * ]
   */
  search (options) {
    options.data = {
      resource: 'order',
      expires: 600,
      rules: options.rules
    }

    return api('POST', `/search`, options)
  },

  /**
   * Fetches all resources from an order
   * @param {Integer} id Order id.
   */
  resources (options) {
    return api('GET', `/order/${options.data.id}/resources`, options)
  },

  /**
   * Regenerates order accessor.
   * @param {Integer} id Order id.
   */
  regenerateAccessor (options) {
    return api('PUT', `/order/${options.data.id}/accessor`, options)
  }
}
