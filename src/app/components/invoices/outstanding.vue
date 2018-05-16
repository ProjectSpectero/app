<template>
  <div class="outstanding">
    <div class="header">
      <p><span class="icon-alert-circle"></span> Outstanding Balance</p>
    </div>
    <div class="body">
      <p class="spaced">
        There is an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong> due on this invoice.
        Please pay before the due date to avoid any late penalties.
      </p>

      <button @click.stop="showPaymentModal" class="button button-info">
        {{ $i18n.t('misc.PAY_NOW') }}
      </button>
    </div>
  </div>
</template>

<script>
import paymentModal from '../payments/paymentModal'

export default {
  props: {
    invoice: Object,
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
  background: $white;
  border: 1px solid $color-info;

  .header {
    width: 100%;
    display: block;
    padding: 14px;
    color: $white;
    font-weight: $font-bold;
    background: $color-info;
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
