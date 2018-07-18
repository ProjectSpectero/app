<template>
  <div
    v-if="user && isImpersonating"
    class="message message-info message-top">
    <div>
      <h5>This isn't you!</h5>
      <p>{{ $i18n.t('users.IMPERSONATING', { name: user.name }) }}</p>
    </div>
    <div class="actions">
      <button
        class="button-dark"
        @click.stop.prevent="stopImpersonating">Stop impersonating</button>
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
      stopImpersonating: 'appAuth/stopImpersonating'
    }),
    testImpersonation () {
      if (getCookie(process.env.IMPERSONATE_COOKIE) !== null) {
        this.startImpersonating()
      }
    }
  }
}
</script>
