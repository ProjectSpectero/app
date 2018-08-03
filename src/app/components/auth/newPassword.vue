<template>
  <div>
    <div v-if="!loading">
      <template v-if="tokenFailed">
        <div class="message message-error">
          {{ $i18n.t('reset.PASSWORD_FAILED') }}
        </div>
      </template>
      <template v-else>
        <div
          class="message message-info"
          v-html="$i18n.t('reset.SUCCESSFUL')"/>

        <div class="new-password">
          <h5 v-html="$i18n.t('reset.YOUR_NEW_PASSWORD')"/>
          <p
            class="new-password-field"
            v-html="newPassword"/>
          <p
            class="password-warning"
            v-html="$i18n.t('reset.PASSWORD_WARNING')"/>
          <copy-to-clipboard
            :field="newPassword"
            button-class="button-sm button-copy"/>
        </div>
      </template>

      <div class="bottom-link">
        <router-link :to="{ name: 'login' }">
          {{ $i18n.t('users.BACK_TO_LOGIN') }}
        </router-link>
      </div>
    </div>
    <loading v-else/>
  </div>
</template>

<script>
import authAPI from '@/app/api/auth'
import loading from '@/shared/components/loading'
import copyToClipboard from '@/shared/components/copyToClipboard'

export default {
  components: {
    loading,
    copyToClipboard
  },
  metaInfo: {
    title: 'Reset Password'
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
  }
}
</script>

<style lang="scss" scoped>
.new-password {
  padding: 8px 0 $pad 0;
  text-align: center;
  border-bottom: 1px solid $color-border;
}
.new-password-field {
  margin-bottom: 8px;
  padding: 8px;
  word-break: break-all;
  border: 2px dashed $color-border;
}
.password-warning {
  margin-top: 8px;
  color: $color-danger;
  font-weight: $font-bold;
}
.button-copy {
  margin-top: 12px;
}
</style>
