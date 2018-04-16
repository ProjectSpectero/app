<template>
  <div class="spectero">
    <sidebar></sidebar>
    <div class="content">
      <modals-container/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import sidebar from '@/shared/components/sidebar'

export default {
  components: {
    sidebar
  }
}
</script>

<style lang="scss" scoped>
.spectero {
  display: flex;
  min-width: fit-content;
}
.content {
  height: 100vh;
  padding: $pad;
  overflow: auto;
  flex: 1;
  padding-bottom: 0;
  position: relative;
}
</style>
