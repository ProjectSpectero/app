import api from './index.js'
import helpers from './helpers'

export default {
  /**
   * Searches the market.
   */
  search (options) {
    return api('POST', helpers.appendQuery(`/market/search`, options.queryParams), options)
  },

  /**
  * Fetches a given item (node / node group) from the market.
  *
  * @param {Integer} id   Node/node group id.
  * @param {String} type  Node or node group.
  */
  fetch (options) {
    return api('GET', `/market/${options.data.type}/${options.data.id}`, options)
  },

  /**
   * Orders the cart items
   */
  order (options) {
    return api('POST', '/order/cart', options)
  },

  /**
   * Returns available plans
   */
  plans (options) {
    return api('GET', '/plan', options)
  }
}
