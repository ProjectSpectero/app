import api from './index.js'

export default {
  /**
   * Retrieves all node groups and their nodes.
   */
  nodeGroups (options) {
    return api('GET', `/node_group/self`, options)
  }
}
