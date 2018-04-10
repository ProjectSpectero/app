<template>
  <div class="search">
    <input type="text" @keyup.enter="search" placeholder="Search orders">
    <button @click.prevent.stop="reset" class="button reset">{{ $i18n.t('misc.RESET') }}</button>
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
