import api from './index.js'

export default {
  /**
   * Fetch remote information.
   */
  remote (options) {
    return api('GET', `/cloud/remote`, options)
  }
}
