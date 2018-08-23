<template>
  <div class="search">
    <input
      type="text"
      placeholder="Search orders"
      @keyup.enter="search">
    <button
      class="button reset"
      @click.prevent.stop="reset">{{ $t('misc.RESET') }}</button>
  </div>
</template>

<script>
export default {
  methods: {
    search (event) {
      this.$emit('search', event.target.value.toLowerCase())
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>
