import invoiceAPI from '@/app/api/invoice'
import orderAPI from '@/app/api/order'
import marketAPI from '@/app/api/market'

export default {
  data () {
    return {
      invoiceId: null,
      invoice: null,
      order: null,
      due: {},
      verified: false,
      verificationErrors: [],
      getTransactions: false,
      transactions: null,
      showCheckout: false,
      loading: true
    }
  },
  created () {
    this.invoiceId = parseInt(this.$route.params.id)
  },
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
    isUnpaid () {
      return ['UNPAID', 'PARTIALLY_PAID'].includes(this.invoice.status)
    },
    isOrderReady () {
      // Standard invoices must be linked to an order that is either pending
      // or active in order for users to be able to pay for it
      if (this.isStandardInvoice) {
        return ['PENDING', 'ACTIVE'].includes(this.order.status)
      }

      return true
    },
    isPayable () {
      // Firstly, check if the invoice status dictactes that the invoice isn't payable
      if (!['UNPAID', 'PARTIALLY_PAID'].includes(this.invoice.status)) {
        return false
      }

      // Check if it's a credit invoice, if so we don't need to check the order status (ie: setup pending order)
      if (this.invoice.type === 'CREDIT') {
        return true
      }

      // Now we deal with standard orders
      if (this.verified && this.verificationErrors.length === 0 && ['PENDING', 'ACTIVE'].includes(this.order.status)) {
        return true
      }

      return false
    }
  },
  methods: {
    async verify () {
      await orderAPI.verify({
        data: {
          id: this.invoice.order_id
        },
        success: response => {
          this.verified = true
          this.verificationErrors = []
        },
        fail: error => {
          this.verified = true
          console.error('Verification check error', error)

          if (typeof error.errors === 'object') {
            for (let key in error.errors) {
              let e = error.errors[key]

              this.verificationErrors.push(e)
              this.lineItems[this.lineItems.findIndex(i => i.id === e.id)].error = e.reason
            }
          } else {
            this.$toasted.error(this.errorAPI(error, 'orders'))
          }
        }
      })
    },
    async fetchOrder () {
      await orderAPI.order({
        data: {
          id: this.invoice.order_id
        },
        success: async response => {
          if (response.data.result) {
            // this.loading = false
            this.error = false
            this.order = response.data.result
          }
        },
        fail: (e) => {
          this.error = true
          this.loading = false
          console.error('Error while fetching order', e)
        }
      })
    },
    async fetchDue () {
      await invoiceAPI.due({
        data: {
          id: this.invoiceId
        },
        success: response => {
          if (response.data.result) {
            this.due = response.data.result
            this.error = false
          }
        },
        fail: e => {
          this.error = true
          console.error('Error while fetching invoice due', e)
        }
      })
    },
    async fetchTransactions () {
      await invoiceAPI.transactions({
        data: {
          id: this.invoiceId
        },
        success: response => {
          if (response.data.result) {
            this.transactions = response.data.result
            this.error = false
          }
        },
        fail: e => {
          this.loading = false
          this.error = true
          console.log('Error while fetching transactions', e)
        }
      })
    },
    async fetchInvoice (callbackDone) {
      await invoiceAPI.invoice({
        data: {
          id: this.invoiceId
        },
        success: async response => {
          if (response.data.result) {
            this.invoice = response.data.result
            this.error = false

            // We only fetch orders for STANDARD invoices - MANUAL and CREDIT don't have orders associated with them
            // Otherwise we skip fetching the order if order.type !== STANDARD
            if (this.invoice.type === 'STANDARD') {
              await this.fetchOrder()

              // Test if this order is fixable (only certain status need the verify + fix combo) for invalid resources
              if (this.isFixable) {
                await this.verify()
              } else {
                this.verified = true
              }
            }

            // If user is on checkout, redirect back to invoice if it's unpayable
            if (this.$route.name === 'checkout' && !this.isPayable) {
              let query = this.invoice.status !== 'PAID' ? { unpayable: null } : {}
              this.$router.push({ name: 'invoice', params: { id: this.invoiceId }, query: query })
            } else {
              this.showCheckout = true
              await this.fetchDue()

              if (this.getTransactions) {
                await this.fetchTransactions()
              }

              this.loading = false

              if (typeof callbackDone === 'function') {
                callbackDone()
              }
            }
          }
        },
        fail: (e) => {
          this.loading = false
          this.error = true
          console.error('Error while fetching invoice', e)
        }
      })
    }
  }
}
