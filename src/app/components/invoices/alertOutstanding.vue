<template>
  <div class="outstanding message message-warning">
    <h5><span class="icon-dollar-sign"></span> Balance Due</h5>
    <p>There is an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong> due on this invoice. Please pay now to avoid any late fees.</p>
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
