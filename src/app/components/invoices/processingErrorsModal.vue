<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $t('invoices.PAY_INVOICE') }}</h2>
      <button
        class="modal-close"
        @click="close"/>
    </div>
    <div class="modal-content">
      <processing-errors
        :error-bag="errorBag"
        :invoice="invoice"
        @close="close"/>
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
      type: Object,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    fixed: {
      type: Function,
      required: true
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
