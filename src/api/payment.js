import api from './index'
import helpers from './helpers'

export default {

  /**
   * Processes a Paypal payment.
   * @param {Integer} invoiceId The invoice id.
   */
  processPaypal (options) {
    return api('POST', `/payment/paypal/process/${options.data.invoiceId}`, options)
  },

  /**
   * Processes a Stripe payment.
   *
   * @param {Integer} invoiceId The invoice id.
   */
  processStripe (options) {
    return api('POST', `/payment/stripe/process/${options.data.invoiceId}`, options)
  },

  /**
   * Processes a direct account credit payment.
   *
   * @param {Integer} invoiceId The invoice id.
   */
  processAccountCredit (options) {
    return api('POST', `/payment/account_credit/process/${options.data.invoiceId}`, options)
  },

  /**
   * Runs the Paypal callback.
   *
   * @param {String} mode Payment mode.
   * @param {String} token Payment token.
   * @param {String} payerID Current payer unique ID.
   */
  paypalCallback (options) {
    return api('GET', `/payment/paypal/callback?mode=${options.data.mode}&token=${options.data.token}&payerID=${options.data.PayerID}`, options)
  },

  /**
   * Creates a new orderless invoice for 'amount' number of credits.
   *
   * @param {Integer} amount The amount of credits to add
   */
  addCredit (options) {
    return api('POST', `/credit/invoice`, options)
  },

  /**
   * Creates an order.
   *
   * @param {Integer} user_id Current user id.
   * @param {String} status Order status.
   * @param {String} subscription_provider Subscription provider (stripe or paypal).
   * @param {String} subscription_reference Subscription reference.
   * @param {String} term Term.
   * @param {String} due_next Next due date.
   */
  createOrder (options) {
    return api('POST', `/order`, options)
  },

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
   * Returns an order.
   * @param {Integer} id Order id.
   */
  order (options) {
    return api('GET', `/order/${options.data.id}`, options)
  },

  /**
   * Returns orders list.
   *
   * @param {String} mode Payment mode.
   * @param {String} token Payment token.
   * @param {String} payerID Current payer unique ID.
   */
  orders (options) {
    return api('GET', `/order`, options)
  },

  /**
   * Returns orders list for the logged in user.
   *
   * @param {String} mode Payment mode.
   * @param {String} token Payment token.
   * @param {String} payerID Current payer unique ID.
   */
  myOrders (options) {
    return api('GET', `/order/self`, options)
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
   * Returns invoices list for the logged in user.
   * Uses the pagination helper to append a given page to the url.
   */
  myInvoices (options) {
    return api('GET', helpers.appendPage(`/invoice/self`, options), options)
  },

  /**
   * Clears data for the paypal provider.
   */
  clearPaypalData (options) {
    return api('DELETE', `/payment/paypal/clear`, options)
  },

  /**
   * Clears data for the stripe provider.
   */
  clearStripeData (options) {
    return api('DELETE', `/payment/stripe/clear`, options)
  }
}
