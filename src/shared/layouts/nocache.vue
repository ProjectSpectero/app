<template>
  <div class="spectero">
    <sidebar/>
    <div class="content">
      <impersonation-bar/>
      <modals-container/>
      <router-view :key="$route.fullPath" />
    </div>
    <help/>
  </div>
</template>

<script>
import sidebar from '@/shared/components/sidebar'
import help from '@/shared/components/docs/panel'
import impersonationBar from '@/shared/components/impersonating'

export default {
  components: {
    sidebar,
    help,
    impersonationBar
  },
  created () {
    console.warn('Nocache layout loaded')
  }
}
</script>
