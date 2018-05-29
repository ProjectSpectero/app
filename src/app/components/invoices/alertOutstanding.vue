<template>
  <div class="outstanding message message-warning">
    <h5><span class="icon-dollar-sign"></span> {{ $i18n.t('invoices.BALANCE_DUE') }}</h5>
    <p v-html="$i18n.t('invoices.BALANCE_DUE_TEXT', { amount: due.amount | currency, currency: due.currency })"></p>
  </div>
</template>

<script>
export default {
  props: {
    invoice: Object,
    due: Object
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .outstanding {
    display: none !important;
  }
}
</style>
