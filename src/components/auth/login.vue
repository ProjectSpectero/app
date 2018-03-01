<template>
  <div>
    <form id="form-login">
      <div class="message info" v-if="!formError && this.$route.query.redirect">
        Please log in to continue.
      </div>

      <div class="message error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="username"
          name="username"
          placeholder="Email address"
          class="input max-width"
          :class="{'input-error': errors.has('username')}"
          :disabled="formDisable"
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
          placeholder="Password"
          class="input max-width"
          :class="{'input-error': errors.has('password')}"
          :disabled="formDisable"
          v-validate="'required'"
          data-vv-as="password">

        <span v-show="errors.has('password')" class="input-error-message">
          {{ errors.first('password') }}
        </span>
      </div>

      <button class="button button-info button-md max-width" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">
        {{ formDisable ? $i18n.t('misc.LOADING') : $i18n.t('users.LOGIN_BUTTON') }}
      </button>
    </form>
    <div class="bottom-link">
      <router-link :to="{ name: 'register' }">Don't have an account? <strong>Create one now</strong></router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import auth from '@/api/auth.js'
import userAPI from '@/api/user.js'

export default {
  metaInfo: {
    title: 'Login'
  },
  data () {
    return {
      username: null,
      password: null,
      formError: null,
      formDisable: false
    }
  },
  methods: {
    ...mapActions({
      storeUser: 'auth/storeUser'
    }),
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          // Disable form while HTTP request being made
          this.formDisable = true
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
        loginSuccess: response => {
          this.fetchUser()
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
      this.formDisable = false

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
