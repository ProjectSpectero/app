<template>
  <div class="outstanding message message-info">
    <h5><span class="icon-dollar-sign"></span> {{ $i18n.t('invoices.BALANCE_DUE') }}</h5>
    <p v-html="$i18n.t('invoices.BALANCE_DUE_TEXT', { amount: currencyString, currency: due.currency })"></p>
    <pay :invoice="invoice" :due="due" classes="button button-info"></pay>
  </div>
</template>

<script>
import pay from './pay'

export default {
  props: {
    invoice: Object,
    due: Object
  },
  computed: {
    currencyString () {
      return this.$options.filters.currency(this.due.amount)
    }
  },
  components: {
    pay
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin-top: 12px;
}
@media print {
  .outstanding {
    display: none !important;
  }
}
</style>
