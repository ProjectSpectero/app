<template>
  <div class="outstanding">
    <div class="header">
      <p>You have an outstanding balance due on this invoice.</p>
    </div>
    <div class="body">
      <p class="spaced">
        There is currently an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong> on this invoice.
        Please pay before the due date to avoid any late penalties, thank you.</p>
      <button @click.stop="showPaymentModal" class="button button-success">{{ $i18n.t('misc.PAY_NOW') }}</button>
    </div>
  </div>
</template>

<script>
import paymentModal from '../payments/paymentModal'

export default {
  props: {
    due: Object
  },
  methods: {
    showPaymentModal () {
      this.$modal.show(paymentModal, {
        invoice: this.invoice,
        due: this.due
      }, {
        height: 'auto'
      })
    }
  },
  components: {
    paymentModal
  }
}
</script>

<style lang="scss" scoped>
.outstanding {
  max-width: 1000px;
  margin-bottom: $pad;
  border: 1px solid $color-warning;

  .header {
    width: 100%;
    display: block;
    padding: 14px;
    color: $color-darker;
    font-weight: $font-bold;
    background: $color-warning;
  }
  .body {
    padding: 14px;
  }
}
@media print {
  .outstanding {
    display: none !important;
  }
}
</style>
