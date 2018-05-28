<template>
  <div class="bar">
    <component :is="barComponent"></component>
  </div>
</template>

<script>
  import restartHTTPProxy from '../services/HTTPProxy/restart'

  export default {
    props: {
      barComponent: String
    },
    components: {
      restartHTTPProxy
    }
  }
</script>

<style lang="scss" scoped>

</style>

