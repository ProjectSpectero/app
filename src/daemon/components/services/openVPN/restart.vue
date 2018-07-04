<template>
  <div class="message message-warning">
    <div>
      <h5>Action required</h5>
      <p>One or more operations require that you restart the {{ service }} service.</p>
    </div>
    <div class="actions">
      <button
        class="button-dark"
        @click.stop.prevent="restart">Restart {{ service }} Now</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import serviceAPI from '@/daemon/api/service'

export default {
  data () {
    return {
      service: 'OpenVPN'
    }
  },
  methods: {
    ...mapActions({
      removeBarComponent: 'settings/removeBarComponent'
    }),
    restart () {
      serviceAPI.manage({
        name: this.service,
        action: 'restart',
        success: response => {
          this.removeBarComponent()
          this.$toasted.success(this.$i18n.t('services.RESTART_SUCCESS'))
        },
        fail: error => {
          console.error(error)
          this.$toasted.error(this.$i18n.t('services.RESTART_ERROR'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
