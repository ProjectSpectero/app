<template>
  <div class="message message-warning unpayable">
    <div>
      <h5>{{ $i18n.t('invoices.UNPAYABLE') }}</h5>
      <p>{{ $i18n.t('invoices.UNPAYABLE_TEXT') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invoice: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .unpayable {
    display: none !important;
  }
}
</style>
