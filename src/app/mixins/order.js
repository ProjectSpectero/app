export default {
  computed: {
    isEnterpriseOrder () {
      console.log('isEnterpriseOrder()')
      return (this.order && this.order.line_items && this.order.line_items.length && this.order.line_items[0].type === 'ENTERPRISE')
    },
    isFixable () {
      console.log('isFixable()')
      if (this.order && !this.isEnterpriseOrder) {
        const options = ['MANUAL_FRAUD_CHECK', 'AUTOMATED_FRAUD_CHECK', 'PENDING']
        const status = this.order.status
        return options.includes(status)
      }

      return false
    }
  }
}
