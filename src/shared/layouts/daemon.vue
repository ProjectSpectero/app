<template>
  <div class="spectero daemon">
    <sidebar/>

    <div class="content">
      <bar
        v-if="barComponent"
        :bar-component="barComponent"/>

      <modals-container/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import bar from '@/daemon/components/common/bar'
import sidebar from '@/shared/components/sidebar'

export default {
  components: {
    sidebar,
    bar
  },
  computed: {
    ...mapGetters({
      barComponent: 'settings/bar'
    })
  },
  async created () {
    if (this.$route.params.nodeId) {
      try {
        await this.autologin(this.$route.params.nodeId)
        console.log('autologin finished')
      } catch (e) {
        this.$toasted.error(this.$i18n.t(`daemon.${e.message}`))
        this.$router.push({ name: 'nodes' })
      }
    } else {
      this.$router.push({ path: '/404' })
    }
  },
  methods: {
    ...mapActions({
      autologin: 'daemonAuth/autologin'
    })
  }
}
</script>
