<template>
  <div
    v-if="user && isImpersonating"
    class="impersonating message message-info message-top">
    <div>
      <h5>This isn't you!</h5>
      <p>{{ $t('users.IMPERSONATING', { name: user.name }) }}</p>
    </div>
    <div class="actions">
      <button
        class="button-dark"
        @click.stop.prevent="stopImpersonation">Stop impersonating</button>
    </div>
  </div>
</template>

<script>
import { getCookie } from 'tiny-cookie'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      isImpersonating: 'appAuth/isImpersonating'
    })
  },
  created () {
    this.testImpersonation()
  },
  methods: {
    ...mapActions({
      startImpersonating: 'appAuth/startImpersonating',
      stopImpersonating: 'appAuth/stopImpersonating',
      addCookie: 'appAuth/addCookie',
      setLoginInfo: 'appAuth/setLoginInfo',
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    testImpersonation () {
      if (getCookie(process.env.VUE_APP_IMPERSONATE_COOKIE) !== null) {
        this.startImpersonating()
      }
    },
    async stopImpersonation () {
      const loginCookie = getCookie(process.env.VUE_APP_IMPERSONATE_COOKIE)

      if (loginCookie) {
        let realCookie = JSON.parse(loginCookie)
        console.log('found real login cookie', realCookie)

        this.addCookie(realCookie)
        this.setLoginInfo(realCookie)
        await this.syncCurrentUser()

        console.log('stopping impersonation on store')
        this.stopImpersonating()

        this.$router.push({ name: 'users-list' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .impersonating {
    display: none !important;
  }
}
</style>
