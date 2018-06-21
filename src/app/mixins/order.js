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
        const options = ['MANUAL_FRAUD_CHECK', 'AUTOMATED_FRAUD_CHECK', 'PENDING']
        const status = this.order.status
        return options.includes(status)
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
        const validOrderStatus = ['PENDING', 'ACTIVE']
        return validOrderStatus.includes(this.order.status)
      }

      return true
    },
    isUnpaid () {
      return this.invoice.status === 'UNPAID'
    },
    isPayable () {
      return ((this.verified && this.verificationErrors.length === 0) || this.isCreditInvoice) &&
        this.isUnpaid &&
        this.isOrderReady
    }
  }
}
