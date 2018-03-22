<template>
  <div class="filters">
    <button @click="filterPrice">Test price fix</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filters: []
    }
  },
  methods: {
    filterPrice () {
      this.filters.push({
        'field': 'nodes.price',
        'operator': '>',
        'value': 100000000
      })

      this.$emit('changedFilters', this.filters)
    }
  }
}
</script>
