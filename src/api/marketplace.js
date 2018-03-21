import api from './index.js'

export default {
  /**
   * Searches the marketplace.
   */
  search (options) {
    return api('POST', `/market/search?includeGrouped=true&perPage=15&page=1`, options)
  }
}
