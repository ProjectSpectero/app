<template>
  <form id="loginForm">
    <div class="message info" v-if="!formError && this.$route.query.redirect">
      Please log in to continue.
    </div>

    <div class="message error" v-if="formError">{{ formError }}</div>

    <div class="form-input">
      <input
        type="text"
        class="input max-width"
        v-model="username" name="username"
        :disabled="formDisable"
        placeholder="Username"
        v-validate="'required'"
        data-vv-as="username"
        :class="{'input-error': errors.has('username')}">

      <span v-show="errors.has('username')" class="input-error-message">
        {{ errors.first('username') }}
      </span>
    </div>

    <div class="form-input">
      <input
        type="password"
        class="input max-width"
        v-model="password" name="password"
        :disabled="formDisable"
        placeholder="Password"
        v-validate="'required'"
        data-vv-as="password"
        :class="{'input-error': errors.has('password')}">

      <span v-show="errors.has('password')" class="input-error-message">
        {{ errors.first('password') }}
      </span>
    </div>

    <button class="button button-info max-width" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">{{ formDisable ? 'Please Wait' : 'Log In' }}</button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import auth from '@/api/auth.js'

export default {
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
    }),
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          // Disable form while HTTP request being made
          this.formDisable = true

          // this.login()
          auth.login({
            data: {
              username: this.username,
              password: this.password
            },
            loginSuccess: msg => {
              // Pre-load user-related data
              this.setup()

              // Move to the front page
              this.dealWithSuccess(msg)
            },
            loginFailed: err => {
              this.dealWithError(err)
            }
          })
        }
      })
    },
    login () {
      const redirect = this.$auth.redirect()

      this.$auth.login({
        data: {
          username: this.username,
          password: this.password
        },
        rememberMe: false,
        redirect: { name: redirect ? redirect.from.name : 'dashboard' },
        fetchUser: false
      }).then(() => {
        console.log('success')
        // Pre-load user-related data
        this.setup()

        // Move to the front page
        this.dealWithSuccess()
      }, (error) => {
        this.dealWithError(error.data)
      })
    },
    async setup () {
      // Add anything that needs preloading here
    },
    dealWithSuccess () {
      // this.formError = null

      // if (this.$route.query.redirect) {
      //   this.$router.push({ path: this.$route.query.redirect })
      // } else {
      //   this.$router.push({ name: 'dashboard' })
      // }
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
  },
  metaInfo: {
    title: 'Login'
  }
}
</script>
