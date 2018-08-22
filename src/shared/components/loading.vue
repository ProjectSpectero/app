<template>
  <div class="alert-msg-centered">
    <div class="loader">
      <div class="spinning-loader"><div/><div/><div/></div>
    </div>

    <div class="text mt-4">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
      default: 'Loading, please wait ...'
    }
  }
}
</script>

<style lang="scss" scoped>
.loader {
  display: inline-block;
}

.text {
  font-size: 1.05rem;
}
</style>
