<template>
  <div>
    <form id="form-login">
      <div class="message message-info" v-if="!formError && this.$route.query.redirect">
        {{ $i18n.t('users.PLEASE_LOGIN') }}
      </div>

      <div class="message message-error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="username"
          name="username"
          :placeholder="$i18n.t('users.PLACEHOLDER_EMAIL')"
          class="input max-width"
          :class="{'input-error': errors.has('username')}"
          :disabled="formLoading"
          v-validate="'required|email'"
          data-vv-as="email">

        <span v-show="errors.has('username')" class="input-error-message">
          {{ errors.first('username') }}
        </span>
      </div>

      <div class="form-input">
        <input
          type="password"
          v-model="password"
          name="password"
          :placeholder="$i18n.t('users.PLACEHOLDER_PASSWORD')"
          class="input max-width"
          :class="{'input-error': errors.has('password')}"
          :disabled="formLoading"
          v-validate="'required'"
          data-vv-as="password">

        <span v-show="errors.has('password')" class="input-error-message">
          {{ errors.first('password') }}
        </span>
      </div>

      <button class="button button-info button-md max-width" @click.prevent="submit" @keyup.enter="submit" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
        {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('users.LOGIN_BUTTON') }}
      </button>
    </form>
    <div class="bottom-link">
      <!-- <router-link :to="{ name: 'register' }">
        {{ $i18n.t('users.NO_ACCOUNT') }}
        <strong>{{ $i18n.t('users.CREATE_ACCOUNT_NOW') }}</strong>
      </router-link> -->

      <router-link :to="{ name: 'resetPassword' }">
        {{ $i18n.t('users.FORGOT_PASSWORD') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import auth from '@/app/api/auth'
import userAPI from '@/app/api/user'

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
  created () {
    this.testAutologin()
  },
  methods: {
    ...mapActions({
      storeUser: 'appAuth/storeUser'
    }),
    testAutologin () {
      if (this.$route.query.autologin !== undefined) {
        this.username = 'dev@spectero.com'
        this.password = 'temppass'
        this.processLogin()
      }
    },
    submit () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          this.formLoading = true
          this.processLogin()
        }
      })
    },
    async processLogin () {
      await auth.login({
        data: {
          username: this.username,
          password: this.password
        },
        loginSuccess: async response => {
          await this.fetchUser()
        },
        loginFailed: error => {
          this.dealWithError(error)
        }
      })
    },
    async fetchUser () {
      await userAPI.getMe({
        success: response => {
          this.formError = null
          this.storeUser(response.data.result)

          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect })
          } else {
            this.$router.push({ name: 'dashboard' })
          }
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    dealWithError (err) {
      this.formLoading = false

      // Get first error key to display main error msg
      for (var errorKey in err.errors) {
        if (err.errors.hasOwnProperty(errorKey)) {
          this.formError = this.$i18n.t(`errors.${errorKey}`)
          break
        }
      }

      // Inject errors into form fields
      for (let inputName in err.fields) {
        if (err.fields.hasOwnProperty(inputName)) {
          let inputErrors = err.fields[inputName]

          for (let errorKey in inputErrors) {
            if (inputErrors.hasOwnProperty(errorKey)) {
              this.$validator.errors.add(inputName, this.$i18n.t(`errors.${errorKey}`, null, { x: inputErrors[errorKey] }))
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
