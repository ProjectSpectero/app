<template>
  <div>
    <div class="message message-warning">
      One or more operations require that you restart the {{ service }} service.
    </div>
    <button @click.stop.prevent="restart" class="button-dark">Restart {{ service }} Now</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import serviceAPI from '../../../api/service.js'

export default {
  data () {
    return {
      service: 'HTTPProxy'
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
          this.$toasted.show(this.$i18n.t('services.RESTART_SUCCESS'))
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
