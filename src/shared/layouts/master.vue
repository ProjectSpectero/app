<template>
  <div class="spectero">
    <sidebar/>
    <div class="content">
      <modals-container/>
      <router-view/>
    </div>
    <help/>
  </div>
</template>

<script>
import sidebar from '@/shared/components/sidebar'
import help from '@/shared/components/docs/panel'

export default {
  components: {
    sidebar,
    help
  }
}
</script>

<style lang="scss" scoped>

</style>
