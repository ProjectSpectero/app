<template>
  <div class="error-screen">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
import sidebar from '@/components/common/sidebar'

export default {
  components: {
    sidebar
  }
}
</script>

<style lang="scss" scoped>
// Defined in assets/styles/pages/_error.scss
</style>
