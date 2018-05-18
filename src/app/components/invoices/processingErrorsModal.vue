<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('invoices.PAY_INVOICE') }}</h2>
      <button @click="close" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <processing-errors :errorBag="errorBag" :invoice="invoice" @close="close"></processing-errors>
    </div>
  </div>
</template>

<script>
import processingErrors from './processingErrors'

export default {
  props: {
    invoice: Object,
    errorBag: Object,
    status: Number,
    fixed: Function
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  components: {
    processingErrors
  }
}
</script>
