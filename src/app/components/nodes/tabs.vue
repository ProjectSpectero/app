<template>
  <ul class="tabs">
    <li v-for="tab in tabs" @click.stop="switchTab(tab.id, tab.hash)" :key="tab.id" :class="(activeTab === tab.id) ? 'active' : ''">
      {{ tab.label }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: Array,
    activeTab: Number
  },
  methods: {
    switchTab (id, hash) {
      this.$emit('switchTab', { id: id, hash: hash })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
