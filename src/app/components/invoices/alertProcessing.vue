<template>
  <div class="processing">
    <div class="header">
      <p><span class="icon-alert-circle"></span> Order</p>
    </div>
    <div class="body">
      <processing-errors :errorBag="errorBag" :invoice="invoice" @close="updateInvoice"></processing-errors>
    </div>
  </div>
</template>

<script>
import processingErrors from './processingErrors'

export default {
  props: {
    invoice: Object,
    errorBag: Object
  },
  methods: {
    updateInvoice () {
      this.$emit('updateInvoice')
    }
  },
  components: {
    processingErrors
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
