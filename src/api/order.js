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
   * Returns orders list for the logged in user.
   *
   * @param {String} mode Payment mode.
   * @param {String} token Payment token.
   * @param {String} payerID Current payer unique ID.
   */
  myOrders (options) {
    return api('GET', helpers.appendQuery(`/order/self`, options), options)
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

    console.log(options)

    return api('POST', `/search`, options)
  }
}
