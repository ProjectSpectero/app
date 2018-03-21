<template>
  <div class="filters">
    filters
  </div>
</template>

<script>
export default {
  methods: {
    changedFilters () {
      this.$emit('changedFilters')
    }
  }
}
</script>
