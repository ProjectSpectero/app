<template>
  <div class="message message-warning message-top">
    <div>
      <h5>Action Required</h5>
      <p>One or more operations require that you restart the daemon.</p>
    </div>
    <div class="actions">
      <button
        class="button-dark"
        @click.stop.prevent="restart">Restart Now</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import cloudAPI from '@/daemon/api/cloud'

export default {
  methods: {
    ...mapActions({
      removeBarComponent: 'settings/removeBarComponent'
    }),
    restart () {
      cloudAPI.restartSystem({
        success: response => {
          this.removeBarComponent()
          this.$toasted.success(this.$i18n.t('cloud.RESTART_SUCCESS'))
        },
        fail: error => {
          console.error(error)
          this.$toasted.error(this.$i18n.t('cloud.RESTART_ERROR'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
