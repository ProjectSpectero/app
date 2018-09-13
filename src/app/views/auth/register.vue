<template>
  <div>
    <h1>{{ $t('misc.REGISTER') }}</h1>
    <form id="form-register">
      <div
        v-if="formError"
        class="message message-error">{{ formError }}</div>

      <div class="form-input">
        <input
          v-validate="'required|email'"
          v-model="email"
          :class="{'input-error': errors.has('email')}"
          :disabled="formLoading"
          type="email"
          name="email"
          placeholder="Email address"
          class="input max-width"
          data-vv-as="email"
          @keyup="$validator.errors.removeById('email_FIELD_UNIQUE')">

        <span
          v-show="errors.has('email')"
          class="input-error-message"
          v-html="errors.first('email')"/>
      </div>

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

      <div class="captcha mt-3 mb-3">
        <vue-recaptcha
          ref="recaptcha"
          :sitekey="recaptchaSitekey"
          @verify="captchaVerify"
          @expired="captchaExpiry"/>
      </div>

      <button
        :class="{ 'is-loading': formLoading }"
        :disabled="formLoading"
        class="button is-info is-medium max-width"
        @click.prevent="submit"
        @keyup.enter="submit">
        {{ formLoading ? $t('misc.LOADING') : $t('users.REGISTER_BUTTON') }}
      </button>
    </form>
    <div class="bottom-link">
      <router-link :to="{ name: 'login' }">Already have an account? <strong>Log in now</strong></router-link>
    </div>
  </div>
</template>

<script>
import auth from '@/app/api/auth'
import VueRecaptcha from 'vue-recaptcha'

export default {
  components: {
    VueRecaptcha
  },
  metaInfo: {
    title: 'Register'
  },
  data () {
    return {
      email: null,
      password: null,
      confirmation: null,
      formError: null,
      formLoading: false,
      captchaKey: null,
      captchaExpired: false
    }
  },
  computed: {
    recaptchaSitekey () {
      return process.env.VUE_APP_GOOGLE_RECAPTCHA_KEY
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$t('errors.VALIDATION_FAILED')
        } else {
          // Check for captcha
          if (this.captchaExpired || !this.captchaKey) {
            this.formError = this.$t('errors.CAPTCHA_VALIDATION_FAILED')
          } else {
            // Disable form while HTTP request being made
            this.formLoading = true
            this.formError = null

            auth.register({
              data: {
                email: this.email,
                password: this.password
              },
              headers: {
                'X-CAPTCHA-RESPONSE': this.captchaKey
              },
              registerSuccess: response => {
                this.dealWithSuccess()
              },
              registerFailed: error => {
                this.dealWithError(error)
              }
            })
          }
        }
      })
    },
    dealWithSuccess () {
      this.formError = null
      this.$router.push({ name: 'welcome' })
    },
    dealWithError (err) {
      this.formLoading = false

      // Reset captcha
      this.$refs.recaptcha.reset()
      this.captchaKey = null

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
                msg: this.$t(`errors.${inputName.toUpperCase()}_${errorKey}`, null, { x: inputErrors[errorKey] })
              })
            }
          }
        }
      }
    },
    captchaVerify (response) {
      this.captchaKey = response
      this.captchaExpired = false
    },
    captchaExpiry () {
      this.captchaKey = null
      this.captchaExpired = true
    }
  }
}
</script>
