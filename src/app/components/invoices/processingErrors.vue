<template>
  <div class="processing">
    <div class="header">
      <p><span class="icon-alert-circle"></span> Order</p>
    </div>
    <div class="body">
      <p class="spaced">
        There is an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong> due on this invoice.
        Please pay before the due date to avoid any late penalties.
      </p>

      <pay :invoice="invoice" :due="due" classes="button button-info" @updateInvoice="updateInvoice"></pay>
    </div>
  </div>
</template>

<script>
import paymentModal from '../payments/paymentModal'
import pay from './pay'

export default {
  props: {
    invoice: Object,
    due: Object
  },
  methods: {
    updateInvoice () {
      this.$emit('updateInvoice')
    }
  },
  components: {
    paymentModal,
    pay
  }
}
</script>

<style lang="scss" scoped>
.processing {
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
  .processing {
    display: none !important;
  }
}
</style>
