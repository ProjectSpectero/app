import api from './index.js'

export default {
  /**
   * Processes a Paypal payment.
   *
   * @param {String} mode Payment mode.
   * @param {String} token Payment token.
   * @param {String} payerID Current payer unique ID.
   */
  processPaypal (options) {
    return api('GET', `/payment/paypal/callback?mode=${options.data.mode}&token=${options.data.token}&payerID=${options.data.PayerID}`, options)
  },

  /**
   * Processes a Stripe payment.
   *
   * @param {String} stripeToken Stripe token.
   * @param {Boolean} save Whether to save or not.
   */
  processStripe (options) {
    return api('POST', `/payment/stripe/process/${options.data.invoiceId}`, options)
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
   * Returns the invoice list.
   */
  invoices (options) {
    return api('GET', `/invoice`, options)
  },

  /**
   * Returns invoices list for the logged in user.
   */
  myInvoices (options) {
    return api('GET', `/invoice/self`, options)
  }
}
