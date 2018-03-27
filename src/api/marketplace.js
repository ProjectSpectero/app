import api from './index.js'
import helpers from './helpers'

export default {
  /**
   * Searches the marketplace.
   */
  search (options) {
    return api('POST', helpers.appendQuery(`/market/search`, options), options)
  },

  /**
  * Fetches a given item (node / node group) from the marketplace.
  *
  * @param {Integer} id   Node/node group id.
  * @param {String} type  Node or node group.
  */
  fetch (options) {
    return api('GET', `/market/${options.data.type}/${options.data.id}`, options)
  }
}
