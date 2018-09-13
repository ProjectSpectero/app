<template>
  <div>
    <div v-if="!loading">
      <h1 v-if="!resetProcessed && !resetFailed">{{ $t('reset.HEADER') }}</h1>

      <div
        v-if="formError"
        class="message is-danger">
        <div class="message-body">{{ formError }}</div>
      </div>

      <template v-else-if="tokenValid && !resetProcessed">
        <div
          v-if="isEasy"
          class="message is-info">
          <div class="message-body">{{ $t('reset.RESET_INFO_MSG_EASY') }}</div>
        </div>
        <div
          v-else
          class="message is-info">
          <div class="message-body">{{ $t('reset.RESET_INFO_MSG') }}</div>
        </div>
      </template>

      <template v-if="tokenValid">
        <form v-if="!resetProcessed">
          <div class="form-input">
            <input
              v-validate="'required|min:5|max:72'"
              ref="passwordRef"
              v-model="password"
              :class="{'input-error': errors.has('password')}"
              :disabled="formLoading"
              type="password"
              name="password"
              placeholder="Password"
              class="input max-width"
              data-vv-as="password">

            <span
              v-show="errors.has('password')"
              class="input-error-message"
              v-html="errors.first('password')"/>
          </div>

          <div class="form-input">
            <input
              v-validate="'required|confirmed:passwordRef'"
              v-model="confirmation"
              :class="{'input-error': errors.has('confirmation')}"
              :disabled="formLoading"
              type="password"
              name="confirmation"
              placeholder="Repeat password"
              class="input max-width"
              data-vv-as="confirmation">

            <span
              v-show="errors.has('confirmation')"
              class="input-error-message"
              v-html="errors.first('confirmation')"/>
          </div>

          <button
            :class="{ 'is-loading': formLoading }"
            :disabled="formLoading"
            class="button is-info is-medium max-width"
            @click.prevent="submit"
            @keyup.enter="submit">
            {{ formLoading ? $t('misc.LOADING') : ( (isEasy) ? $t('reset.SET_BUTTON') : $t('reset.CHANGE_BUTTON') ) }}
          </button>
        </form>
        <template v-else>
          <div
            v-if="!resetFailed"
            class="reset-complete">
            <div class="icon-check-circle mb-3"/>
            <h3>{{ $t('reset.RESET_COMPLETE') }}</h3>
            <p class="mb-3">{{ $t('reset.RESET_COMPLETE_TEXT') }}</p>
            <router-link
              :to="{ name: 'login' }"
              class="button">
              {{ $t('users.BACK_TO_LOGIN') }}
            </router-link>
          </div>
        </template>
      </template>

      <div
        v-else
        class="bottom-link">
        <router-link :to="{ name: 'login' }">
          {{ $t('users.BACK_TO_LOGIN') }}
        </router-link>
      </div>
    </div>
    <loading v-else/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import authAPI from '@/app/api/auth'
import loading from '@/shared/components/loading'

export default {
  components: {
    loading
  },
  metaInfo: {
    title: 'Reset Password'
  },
  data () {
    return {
      formError: null,
      formLoading: false,
      tokenValid: false,
      password: null,
      confirmation: null,
      resetProcessed: false,
      resetFailed: false
    }
  },
  computed: {
    token () {
      return this.$route.params.token
    },
    isEasy () {
      return this.$route.query.easy
    }
  },
  async created () {
    await this.validate()
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    async validate () {
      await authAPI.validateResetToken({
        data: {
          token: this.token
        },
        success: response => {
          this.loading = false
          this.tokenValid = true
        },
        fail: error => {
          this.loading = false
          this.tokenValid = false
          this.formError = this.$t('reset.PASSWORD_FAILED')
          console.error('Error validating reset token', error)
        }
      })
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$t('errors.VALIDATION_FAILED')
        } else {
          // Disable form while HTTP request being made
          this.formLoading = true
          this.formError = null

          authAPI.processPasswordReset({
            data: {
              token: this.token,
              password: this.password
            },
            success: response => {
              this.loading = false
              this.resetProcessed = true
              this.resetFailed = false

              // Autologin easy register users, as per Pro checkout flow spec
              if (this.isEasy) {
                this.login()
              }
            },
            fail: error => {
              this.loading = false
              this.resetProcessed = true
              this.resetFailed = true
              this.formError = this.$t('reset.PASSWORD_FAILED')
              console.error('Error resetting password', error)
            }
          })
        }
      })
    },
    login () {
      if (this.isEasy && this.$route.query.for) {
        authAPI.login({
          data: {
            username: this.$route.query.for,
            password: this.password
          },
          loginSuccess: async response => {
            await this.syncCurrentUser()

            this.$router.push({ name: 'dashboard' })
          },
          loginFailed: error => {
            console.error('Autologin fail (easy)', error)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-complete {
  text-align: center;

  [class^="icon-"] {
    font-size: 56px;
    color: $color-success;
  }
}
</style>
