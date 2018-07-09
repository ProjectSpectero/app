export default {
  computed: {
    isEnterpriseOrder () {
      return (this.order && this.order.line_items && this.order.line_items.length && this.order.line_items[0].type === 'ENTERPRISE')
    },
    isCreditInvoice () {
      return this.invoice.type === 'CREDIT'
    },
    isFixable () {
      if (this.order && !this.isEnterpriseOrder) {
        return ['MANUAL_FRAUD_CHECK', 'AUTOMATED_FRAUD_CHECK', 'PENDING'].includes(this.order.status)
      }

      return false
    },
    isStandardInvoice () {
      return (this.invoice && this.invoice.order_id && this.invoice.type && this.invoice.type === 'STANDARD')
    },
    isOrderReady () {
      // STAMDARD invoices must be linked to an order that is
      // either PENDING or ACTIVE in order for users to be able to pay for it
      if (this.isStandardInvoice) {
        return ['PENDING', 'ACTIVE'].includes(this.order.status)
      }

      return true
    },
    isUnpaid () {
      return ['UNPAID', 'PARTIALLY_PAID'].includes(this.invoice.status)
    },
    isPayable () {
      return ((this.verified && this.verificationErrors.length === 0) || this.isCreditInvoice) &&
        this.isUnpaid &&
        this.isOrderReady
    }
  }
}
