<template>
  <div class="spectero">
    <sidebar/>
    <div class="content">
      <div class="auth">
        <div class="auth-container">
          <router-view/>
        </div>
      </div>
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
// Defined in assets/styles/pages/_auth.scss
</style>
