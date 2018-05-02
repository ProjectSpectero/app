<template>
  <ul class="tabs">
    <li v-for="tab in tabs" @click.stop="switchTab(tab.id, tab.path)" :key="tab.id" :class="(activeTab === tab.id) ? 'active' : ''">
      {{ tab.label }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: Array,
    activeTab: String
  },
  methods: {
    switchTab (id, path) {
      this.$emit('switchTab', { id: id, path: path })
    }
  }
}
</script>
