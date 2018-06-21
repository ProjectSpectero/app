<template>
  <div class="unpayable">
    <header>
      <h5>Unpayable</h5>
    </header>
    <section class="body">
      body
    </section>
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

<style>

</style>
