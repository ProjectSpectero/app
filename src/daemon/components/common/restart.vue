<template>
  <div class="col-container mt-3">
    <div class="message message-warning col-12">
      <div>
        <h5>Action required</h5>
        <p>One or more operations require that you restart the daemon.</p>
      </div>
      <div class="actions">
        <button
          class="button-dark"
          @click.stop.prevent="restart">Restart Daemon Now</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'

export default {
  methods: {
    // ...mapActions({
    //   removeBarComponent: 'settings/removeBarComponent'
    // }),
    // restart () {
    //   serviceAPI.manage({
    //     name: this.service,
    //     action: 'restart',
    //     success: response => {
    //       this.removeBarComponent()
    //       this.$toasted.success(this.$i18n.t('services.RESTART_SUCCESS'))
    //     },
    //     fail: error => {
    //       console.error(error)
    //       this.$toasted.error(this.$i18n.t('services.RESTART_ERROR'))
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
