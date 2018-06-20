<template>
  <ul class="tabs">
    <li
      v-for="(item, index) in routes"
      :key="index"
      :class="{ active: item.route === $route.name }"
      @click.prevent.stop="selectRoute(item.route)">
      {{ item.label }}
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      routes: [
        { label: 'All Listings', route: 'marketListed' },
        { label: 'My Listings', route: 'marketMine' }
      ]
    }
  },
  methods: {
    selectRoute (route) {
      this.$emit('selectedRoute', route)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
