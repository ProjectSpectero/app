<template>
  <div>
    <component :is="barComponent"/>
  </div>
</template>

<script>
import restart from '@/daemon/components/common/restart'
import restartHTTPProxy from '@/daemon/components/services/HTTPProxy/restart'

export default {
  components: {
    restart,
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
