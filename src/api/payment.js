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
  }
}
