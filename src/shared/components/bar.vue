<template>
  <div class="bar">
    <component :is="barComponent"/>
  </div>
</template>

<script>
import restartHTTPProxy from '../services/HTTPProxy/restart'

export default {
  components: {
    restartHTTPProxy
  },
  props: {
    barComponent: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
