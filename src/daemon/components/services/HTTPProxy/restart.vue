<template>
  <div class="restart">
    One or more operations require that you restart the {{ service }} service.
    <button @click.stop.prevent="restart" class="button">Restart {{ service }} now</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
          this.$toasted.error(this.$i18n.t('services.RESTART_ERROR'))
        }
      })
    }
  }
}
</script>
