<template>
  <div>
    <form id="form-register">
      <div class="message message-error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="email"
          name="email"
          placeholder="Email address"
          class="input max-width"
          :class="{'input-error': errors.has('email')}"
          :disabled="formLoading"
          v-validate="'required|email'"
          data-vv-as="email">

        <span v-show="errors.has('email')" class="input-error-message">
          {{ errors.first('email') }}
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
          :disabled="formLoading"
          v-validate="'required|min:5|max:72'"
          data-vv-as="password">

        <span v-show="errors.has('password')" class="input-error-message">
          {{ errors.first('password') }}
        </span>
      </div>

      <button class="button-info button-md max-width" @click.prevent="submit" @keyup.enter="submit" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
        {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('users.REGISTER_BUTTON') }}
      </button>
    </form>
    <div class="bottom-link">
      <router-link :to="{ name: 'login' }">Already have an account? <strong>Log in now</strong></router-link>
    </div>
  </div>
</template>

<script>
import auth from '@/app/api/auth.js'

export default {
  metaInfo: {
    title: 'Register'
  },
  data () {
    return {
      email: null,
      password: null,
      formError: null,
      formLoading: false
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          // Disable form while HTTP request being made
          this.formLoading = true

          auth.register({
            data: {
              email: this.email,
              password: this.password
            },
            registerSuccess: response => {
              this.dealWithSuccess()
            },
            registerFailed: error => {
              this.dealWithError(error)
            }
          })
        }
      })
    },
    dealWithSuccess () {
      this.formError = null
      this.$router.push({ name: 'pending' })
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
              this.$validator.errors.add(inputName, this.$i18n.t(`errors.${inputName.toUpperCase()}_${errorKey}`, null, { x: inputErrors[errorKey] }))
            }
          }
        }
      }
    }
  }
}
</script>
