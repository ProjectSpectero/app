import api from './index'
import helpers from './helpers'

export default {
  /**
   * Creates an invoice.
   *
   * @param {Integer} order_id Current order id.
   * @param {Integer} user_id Current user id.
   * @param {Integer} amount Amount.
   * @param {Integer} tax Tax.
   * @param {String} status Order status.
   * @param {String} due_next Next due date.
   */
  createInvoice (options) {
    return api('POST', `/invoice`, options)
  },

  /**
   * Returns an invoice.
   * @param {Integer} id Invoice id.
   */
  invoice (options) {
    return api('GET', `/invoice/${options.data.id}`, options)
  },

  /**
   * Returns the due amount for an invoice.
   * @param {Integer} id Invoice id.
   */
  due (options) {
    return api('GET', `/invoice/${options.data.id}/due`, options)
  },

  /**
   * Returns the transaction list for an invoice.
   * @param {Integer} id Invoice id.
   */
  transactions (options) {
    return api('GET', `/invoice/${options.data.id}/transactions?perPage=15`, options)
  },

  /**
   * Returns the invoices list for the logged in user.
   */
  myInvoices (options) {
    return api('GET', helpers.appendQuery(`/invoice/self`, options.queryParams), options)
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
      resource: 'invoice',
      expires: 600,
      rules: options.rules
    }

    return api('POST', `/search`, options)
  }
}
