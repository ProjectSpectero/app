<template>
  <div class="processing message message-warning">
    <h5><span class="icon-alert-circle"></span> Resources Unavailable</h5>
    <processing-errors :errorBag="errorBag" :invoice="invoice" @close="update"></processing-errors>
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
    update () {
      this.$emit('update')
    }
  },
  components: {
    processingErrors
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
