import api from './index.js'

export default {
  /**
   * Retrieves all node groups and their nodes.
   */
  nodeGroups (options) {
    return api('GET', `/node_group/self`, options)
  },

  /**
   * Creates node from given parameters.
   */
  create (options) {
    return api('POST', `/node`, options)
  },

  /**
   * Edit node details.
   *
   * @param {Integer} id       User id to edit.
   */
  edit (options) {
    return api('PUT', `/node/${options.data.id}`, options)
  },

  /**
   * Delete node at given id.
   *
   * @param {Integer} id Node id to delete.
   */
  delete (options) {
    return api('DELETE', `/node/${options.data.id}`, options)
  }
}
