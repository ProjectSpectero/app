<template>
  <button @click.stop="showPaymentModal" :class="classes">
    {{ $i18n.t('misc.PAY_NOW') }}
  </button>
</template>

<script>
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
      this.$emit('update')

      this.$modal.show(paymentModal, {
        invoice: this.invoice,
        due: this.due
      }, {
        height: 'auto'
      })
    }
  },
  components: {
    paymentModal,
    processingErrorsModal
  }
}
</script>
