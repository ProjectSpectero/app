<template>
  <div>
    <div v-if="!loading">
      <template v-if="tokenFailed">
        <div class="message message-error">
          {{ $i18n.t('users.NEW_PASSWORD_FAILED') }}
        </div>
      </template>
      <template v-else>
        <div class="message message-success">
          <p v-html="$i18n.t('users.NEW_PASSWORD_ISSUED', { password: newPassword })"></p>
        </div>
      </template>

      <div class="bottom-link">
        <router-link :to="{ name: 'login' }">
          {{ $i18n.t('users.BACK_TO_LOGIN') }}
        </router-link>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import authAPI from '@/app/api/auth'
import loading from '@/shared/components/loading'

export default {
  metaInfo: {
    title: 'Reset password'
  },
  data () {
    return {
      tokenFailed: false
    }
  },
  async created () {
    await this.validate()
  },
  methods: {
    async validate () {
      await authAPI.validatePasswordReset({
        data: { token: this.$route.params.token },
        success: response => {
          if (response.data.message !== 'PASSWORD_RESET_SUCCESS' && response.data.result.new_password !== undefined) {
            this.tokenFailed = true
          } else {
            this.tokenFailed = false
            this.newPassword = response.data.result.new_password
          }

          this.loading = false
        },
        fail: error => {
          console.log(error)
          this.tokenFailed = true
          this.loading = false
        }
      })
    }
  },
  components: {
    loading
  }
}
</script>
