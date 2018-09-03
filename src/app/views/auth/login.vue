<template>
  <div>
    <h1>{{ $t('misc.LOGIN') }}</h1>
    <form id="form-login">
      <div
        v-if="!formError && this.$route.query.redirect"
        class="message message-info">
        {{ $t('users.PLEASE_LOGIN') }}
      </div>

      <div
        v-if="formError"
        class="message message-error">{{ formError }}</div>

      <div class="form-input">
        <input
          v-validate="'required|email'"
          v-model="username"
          :placeholder="$t('users.PLACEHOLDER_EMAIL')"
          :class="{'input-error': errors.has('username')}"
          :disabled="formLoading"
          type="text"
          name="username"
          class="input max-width"
          data-vv-as="email">

        <span
          v-show="errors.has('username')"
          class="input-error-message"
          v-html="errors.first('username')"/>
      </div>

      <div class="form-input">
        <input
          v-validate="'required'"
          v-model="password"
          :placeholder="$t('users.PLACEHOLDER_PASSWORD')"
          :class="{'input-error': errors.has('password')}"
          :disabled="formLoading"
          type="password"
          name="password"
          class="input max-width"
          data-vv-as="password">

        <span
          v-show="errors.has('password')"
          class="input-error-message"
          v-html="errors.first('password')"/>
      </div>

      <button
        :class="{ 'button-loading': formLoading }"
        :disabled="formLoading"
        class="button-info button-md max-width"
        @click.prevent="submit"
        @keyup.enter="submit">
        {{ formLoading ? $t('misc.LOADING') : $t('users.LOGIN_BUTTON') }}
      </button>
    </form>
    <div class="bottom-link">
      <!-- <router-link :to="{ name: 'register' }">
        {{ $t('users.NO_ACCOUNT') }}
        <strong>{{ $t('users.CREATE_ACCOUNT_NOW') }}</strong>
      </router-link> -->

      <router-link :to="{ name: 'resetPassword' }">
        {{ $t('users.FORGOT_PASSWORD') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import auth from '@/app/api/auth'

export default {
  metaInfo: {
    title: 'Login'
  },
  data () {
    return {
      username: null,
      password: null,
      formError: null,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isEnterprise: 'appAuth/isEnterprise'
    }),
    environment () {
      console.log(process.env)
      return process.env.NODE_ENV
    }
  },
  created () {
    this.autoLogin()
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    autoLogin () {
      if (this.nodeEnvironment !== 'production' && this.$route.query.autologin !== undefined) {
        this.username = 'dev@spectero.com'
        this.password = 'temppass'
        this.processLogin()
      }
    },
    submit () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$t(`errors.VALIDATION_FAILED`)
        } else {
          this.formLoading = true
          this.formError = null
          this.processLogin()
        }
      })
    },
    async processLogin () {
      let loggedIn = false

      await auth.login({
        data: {
          username: this.username,
          password: this.password
        },
        loginSuccess: response => {
          loggedIn = true
        },
        loginFailed: error => {
          this.dealWithError(error)
        }
      })

      if (loggedIn) {
        await this.syncCurrentUser()

        if (this.$route.query.redirect) {
          this.$router.push({ path: this.$route.query.redirect })
        } else {
          this.$router.push({ name: (this.isEnterprise) ? 'enterpriseOrders' : 'dashboard' })
        }
      }
    },
    dealWithError (err) {
      this.formLoading = false

      // Get first error key to display main error msg
      for (var errorKey in err.errors) {
        if (err.errors.hasOwnProperty(errorKey)) {
          this.formError = this.$t(`errors.${errorKey}`)
          break
        }
      }

      // Inject errors into form fields
      for (let inputName in err.fields) {
        if (err.fields.hasOwnProperty(inputName)) {
          let inputErrors = err.fields[inputName]

          for (let errorKey in inputErrors) {
            if (inputErrors.hasOwnProperty(errorKey)) {
              this.$validator.errors.add({
                id: `${inputName}_${errorKey}`,
                field: inputName,
                msg: this.$t(`errors.${errorKey}`, null, { x: inputErrors[errorKey] })
              })
            }
          }
        }
      }
    },
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>
