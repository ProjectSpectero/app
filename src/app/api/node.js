import api from './index.js'
import helpers from './helpers'

export default {
  /**
   * Retrieves all node groups and their nodes.
   */
  groups (options) {
    return api('GET', `/node_group/self?page=${options.groupsPage}&perPage=${options.perPage}`, options)
  },

  /**
   * Returns a node.
   * @param {Integer} id Node id.
   */
  node (options) {
    return api('GET', `/node/${options.data.id}`, options)
  },

  /**
   * Returns my nodes.
   */
  myNodes (options) {
    return api('GET', helpers.appendQuery(`/node/self`, options), options)
  },

  /**
   * Retrieves all uncategorized nodes.
   */
  uncategorizedNodes (options) {
    return api('GET', helpers.appendQuery(`/node/self/uncategorized`, options), options)
  },

  /**
   * Returns a node's engagements.
   * @param {Integer} id Node id.
   */
  nodeEngagements (options) {
    return api('GET', `/node/${options.data.id}/engagements`, options)
  },

  /**
   * Returns a node's services.
   * @param {Integer} id Node id.
   */
  nodeServices (options) {
    return api('GET', `/node/${options.data.id}/services`, options)
  },

  /**
   * Returns a node's ips.
   * @param {Integer} id Node id.
   */
  nodeIps (options) {
    return api('GET', `/node/${options.data.id}/ips`, options)
  },

  /**
   * Verifies a node. Only allowed for nodes with status = 'unconfirmed'
   * @param {Integer} id Node id.
   */
  verify (options) {
    return api('GET', `/node/${options.data.id}/verify`, options)
  },

  /**
   * Returns a node group.
   * @param {Integer} id Node group id.
   */
  group (options) {
    return api('GET', `/node_group/${options.data.id}`, options)
  },

  /**
   * Returns a node group's engagements.
   * @param {Integer} id Node group id.
   */
  groupEngagements (options) {
    return api('GET', `/node_group/${options.data.id}/engagements`, options)
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
    return api('PUT', `/node_group/${options.data.id}`, options)
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
    return api('DELETE', `/node_group/${options.data.id}`, options)
  },

  /**
   * Deletes an engagement.
   *
   * @param {Integer} id Engagement id to delete.
   */
  deleteEngagement (options) {
    return api('DELETE', `/engagement/${options.data.id}`, options)
  },

  /**
   * Automatically logs into the daemon application, retrieving the JWT token
   * for a given node.
   *
   * @param {Integer} id Node group id to delete.
   */

  nodeLogin (options) {
    return api('GET', `/node/${options.data.id}/auth`, options)
  },

  /**
   * Searches and filters nodes. Example rules:
   * "rules": [
   *     {
   *         "field": "id",
   *         "operator": "=",
   *         "value": "1"
   *     }
   * ]
   */
  search (options) {
    options.data = {
      resource: 'node',
      expires: 600,
      rules: options.rules
    }

    return api('POST', `/search`, options)
  }
}
