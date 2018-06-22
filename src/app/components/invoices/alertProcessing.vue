<template>
  <div class="message message-danger processing">
    <div>
      <h5>{{ $i18n.t('invoices.RESOURCES_NOT_AVAILABLE') }}</h5>
      <p>{{ $i18n.t('invoices.RESOURCES_NOT_AVAILABLE_TEXT') }}</p>
      <p>{{ $i18n.t('invoices.FIX_ORDER_TEXT') }}</p>
      <p class="actions">
        <processing-errors
          :error-bag="errorBag"
          :invoice="invoice"
          @close="update"/>
      </p>
    </div>
  </div>
</template>

<script>
import processingErrors from './processingErrors'

export default {
  components: {
    processingErrors
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    errorBag: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    update () {
      this.$emit('update')
    }
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .processing {
    display: none !important;
  }
}
</style>
