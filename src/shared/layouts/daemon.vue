<template>
  <div class="spectero daemon">
    <sidebar></sidebar>
    <div class="content">
      <modals-container/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sidebar from '@/shared/components/sidebar'

export default {
  async created () {
    if (this.$route.params.nodeId) {
      try {
        await this.autologin(this.$route.params.nodeId)
        console.log(`autologin success (frontend)`)
        await this.syncCurrentUser()
      } catch (e) {
        console.error(`autologin failed (frontend)`, e)
        this.$toasted.error(this.$i18n.t(`daemon.${e.message}`))
        this.$router.push({ name: 'nodes' })
      }
    } else {
      this.$router.push({ path: '/404' })
    }
  },
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user'
    })
  },
  methods: {
    ...mapActions({
      autologin: 'daemonAuth/autologin',
      syncCurrentUser: 'daemonAuth/syncCurrentUser'
    })
  },
  components: {
    sidebar
  }
}
</script>

<style lang="scss" scoped>
.spectero {
  display: flex;
  min-width: fit-content;
}
.content {
  height: 100vh;
  overflow: auto;
  flex: 1;
  padding-bottom: 0;
  position: relative;
}
</style>
