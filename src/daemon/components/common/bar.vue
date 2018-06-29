<template>
  <div>
    <component :is="barComponent"/>
  </div>
</template>

<script>
import restartHTTPProxy from '@/daemon/components/services/HTTPProxy/restart'

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
