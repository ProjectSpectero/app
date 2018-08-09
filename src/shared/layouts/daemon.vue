<template>
  <div class="spectero daemon">
    <sidebar/>

    <div
      v-if="daemonInitialized"
      class="content">
      <modals-container/>
      <impersonation-bar/>
      <bar
        v-if="barComponent"
        :bar-component="barComponent"/>

      <template v-if="specs && node">
        <router-view :key="$route.fullPath"/>
      </template>
      <loading
        v-else
        text="Loading daemon ..."/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import bar from '@/daemon/components/common/bar'
import loading from '@/shared/components/loading'
import sidebar from '@/shared/components/sidebar'
import impersonationBar from '@/shared/components/impersonating'

export default {
  components: {
    sidebar,
    bar,
    loading,
    impersonationBar
  },
  computed: {
    ...mapGetters({
      daemonInitialized: 'daemonAuth/initialized',
      specs: 'daemonAuth/specs',
      node: 'daemonAuth/node',
      barComponent: 'settings/bar'
    })
  },
  async created () {
    if (this.$route.params.nodeId) {
      try {
        await this.autologin()
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
