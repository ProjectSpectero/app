<template>
  <button
    :class="classes"
    @click.stop="showPaymentModal">
    {{ $i18n.t('misc.PAY_NOW') }}
  </button>
</template>

<script>
import paymentModal from '../payments/paymentModal'

export default {
  components: {
    paymentModal
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    due: {
      type: Object,
      required: true
    },
    classes: {
      type: String,
      required: false,
      default: ''
    }
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
  }
}
</script>
