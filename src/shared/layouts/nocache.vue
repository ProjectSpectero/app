<template>
  <div class="app-container">
    <nav-bar/>
    <div class="page-content">
      <impersonation-bar/>
      <modals-container/>
      <router-view :key="$route.fullPath" />
    </div>
    <help/>
  </div>
</template>

<script>
import navBar from '@/shared/components/navBar'
import help from '@/shared/components/docs/panel'
import impersonationBar from '@/shared/components/impersonating'

export default {
  components: {
    navBar,
    help,
    impersonationBar
  }
}
</script>
