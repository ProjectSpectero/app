<template>
  <button @click.stop="verify" :class="classes">
    {{ $i18n.t('misc.PAY_NOW') }}
  </button>
</template>

<script>
import orderAPI from '@/app/api/order'
import paymentModal from '../payments/paymentModal'
import processingErrorsModal from './processingErrorsModal'

export default {
  props: {
    invoice: Object,
    due: Object,
    classes: String
  },
  methods: {
    async showPaymentModal () {
      this.$modal.show(paymentModal, {
        invoice: this.invoice,
        due: this.due
      }, {
        height: 'auto'
      })
    },
    async verify () {
      await orderAPI.verify({
        data: { id: this.invoice.order_id },
        success: response => {
          this.showPaymentModal()
        },
        fail: async error => {
          if (typeof error.errors === 'object') {
            // Open error modal
            this.$modal.show(processingErrorsModal, {
              invoice: this.invoice,
              errorBag: error.errors,
              fixed: () => {
                console.log('here')
                // this.showPaymentModal()
              }
            }, {
              height: 'auto'
            })
          } else {
            this.$toasted.error(this.errorAPI(error, 'orders'))
          }
        }
      })
    }
  },
  components: {
    paymentModal,
    processingErrorsModal
  }
}
</script>
