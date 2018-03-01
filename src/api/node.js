import api from './index.js'

export default {
  /**
   * Retrieves all node groups and their nodes.
   */
  nodeGroups (options) {
    return api('GET', `/node_group/self`, options)
  },

  /**
   * Returns a node.
   * @param {Integer} id Node id.
   */
  node (options) {
    return api('GET', `/node/${options.data.id}`, options)
  },

  /**
   * Returns a node group.
   * @param {Integer} id Node group id.
   */
  group (options) {
    return api('GET', `/node_group/${options.data.id}`, options)
  },

  /**
   * Creates node from given parameters.
   */
  create (options) {
    return api('POST', `/node`, options)
  },

  /**
   * Edit node details.

   * @param {Integer} id Node id to edit.
   */
  edit (options) {
    return api('PUT', `/node/${options.data.id}`, options)
  },

  /**
   * Edit node group details.

   * @param {Integer} id Group id to edit.
   */
  editGroup (options) {
    return api('PUT', `/group/${options.data.id}`, options)
  },

  /**
   * Delete node at given id.
   *
   * @param {Integer} id Node id to delete.
   */
  delete (options) {
    return api('DELETE', `/node/${options.data.id}`, options)
  },

  /**
   * Delete a node group at given id.
   *
   * @param {Integer} id Node group id to delete.
   */
  deleteGroup (options) {
    return api('DELETE', `/group/${options.data.id}`, options)
  }
}
