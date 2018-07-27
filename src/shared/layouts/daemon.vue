<template>
  <div class="spectero daemon">
    <sidebar/>

    <div class="content">
      <impersonation-bar/>
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
import nodeAPI from '@/app/api/node'
import bar from '@/daemon/components/common/bar'
import sidebar from '@/shared/components/sidebar'
import impersonationBar from '@/shared/components/impersonating'

export default {
  components: {
    sidebar,
    bar,
    impersonationBar
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
      addCookie: 'daemonAuth/addCookie',
      setupEndpoint: 'daemonAuth/setupEndpoint',
      syncCurrentUser: 'daemonAuth/syncCurrentUser'
    }),
    async autologin (nodeId) {
      await nodeAPI.nodeLogin({
        data: {
          id: nodeId
        },
        success: async response => {
          console.log('Auto-login started, setting up daemon data', response)
          await this.setup(response.data.result)
        },
        fail: error => {
          console.log('Auto-login failed', error)
          const e = Object.keys(error.errors)[0] || 'AUTOLOGIN_FAIL'
          throw new Error(e)
        }
      })
    },
    async setup (data) {
      await this.addCookie(data)
      await this.setupEndpoint(data)
      await this.syncCurrentUser()
    }
  }
}
</script>
