import api from './index.js'
import helpers from './helpers'

export default {
  /**
   * Searches the marketplace.
   */
  search (options) {
    return api('POST', helpers.appendQuery(`/market/search`, options), options)
  }
}
