import api from './index'

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
   * Processes a Coinbase Commerce payment.
   * @param {Integer} invoiceId The invoice id.
   */
  processCrypto (options) {
    return api('POST', `/payment/crypto/process/${options.data.invoiceId}`, options)
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
   * Retrieves the maximum amount of USD credits a user can purchase.
   */
  getMaxCredit (options) {
    return api('GET', `credit/max`, options)
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
  },

  /**
   * Applies promo code to account.
   */
  applyPromoCode (options) {
    return api('POST', `/promo/code/apply`, options)
  }
}
