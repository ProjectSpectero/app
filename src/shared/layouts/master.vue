<template>
  <div class="spectero">
    <sidebar></sidebar>
    <div class="content">
      <modals-container/>
      <router-view></router-view>
    </div>
    <help></help>
  </div>
</template>

<script>
import sidebar from '@/shared/components/sidebar'
import help from '@/shared/components/help/panel'

export default {
  components: {
    sidebar,
    help
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
  overflow: auto;
  flex: 1;
  padding-bottom: 0;
  position: relative;
}
</style>
