<template>
  <div class="alert-bar">
    <component :is="barComponent"/>
  </div>
</template>

<script>
import restart from '@/daemon/components/common/restart'
import restartHTTPProxy from '@/daemon/components/services/HTTPProxy/restart'
import restartOpenVPN from '@/daemon/components/services/openVPN/restart'

export default {
  components: {
    restart,
    restartHTTPProxy,
    restartOpenVPN
  },
  props: {
    barComponent: {
      type: String,
      required: true
    }
  }
}
</script>
