<template>
  <ul class="tabs">
    <li
      v-for="tab in tabs"
      :key="tab.id"
      :class="(activeTab === tab.id) ? 'active' : ''"
      @click.stop="switchTab(tab.id, tab.path)">
      {{ tab.label }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  methods: {
    switchTab (id, path) {
      this.$emit('switchTab', { id: id, path: path })
    }
  }
}
</script>
