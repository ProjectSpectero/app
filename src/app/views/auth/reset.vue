<template>
  <div>
    <h1>{{ $t('misc.RESET_PASSWORD') }}</h1>
    <form>
      <template v-if="tokenIssued">
        <div class="message is-success">
          <div class="message-body">{{ $t('reset.TOKEN_ISSUED', { email: email }) }}</div>
        </div>
      </template>
      <template v-else>
        <div
          v-if="formError"
          class="message is-danger">
          <div class="message-body">{{ formError }}</div>
        </div>

        <div class="form-input">
          <input
            v-validate="'required|email'"
            v-model="email"
            :placeholder="$t('users.PLACEHOLDER_EMAIL')"
            :class="{'input-error': errors.has('email')}"
            :disabled="formLoading"
            type="email"
            name="email"
            class="input max-width"
            data-vv-as="email">

          <span
            v-show="errors.has('email')"
            class="input-error-message"
            v-html="errors.first('email')"/>
        </div>

        <div class="captcha mt-2 mb-2">
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
          {{ formLoading ? $t('misc.LOADING') : $t('users.RESET_PASSWORD_BUTTON') }}
        </button>
      </template>
    </form>

    <div class="bottom-link">
      <router-link :to="{ name: 'login' }">
        {{ $t('users.BACK_TO_LOGIN') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import authAPI from '@/app/api/auth'
import VueRecaptcha from 'vue-recaptcha'

export default {
  components: {
    VueRecaptcha
  },
  metaInfo: {
    title: 'Reset Password'
  },
  data () {
    return {
      email: null,
      tokenIssued: false,
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
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$t(`errors.VALIDATION_FAILED`)
        } else {
          // Check for captcha
          if (this.captchaExpired || !this.captchaKey) {
            this.formError = this.$t('errors.CAPTCHA_VALIDATION_FAILED')
          } else {
            this.formLoading = true
            this.formError = null
            this.reset()
          }
        }
      })
    },
    async reset () {
      await authAPI.requestPasswordReset({
        data: {
          email: this.email
        },
        headers: {
          'X-CAPTCHA-RESPONSE': this.captchaKey
        },
        success: response => {
          if (response.data.message && response.data.message === 'PASSWORD_RESET_TOKEN_ISSUED') {
            this.tokenIssued = true
            this.formLoading = false
          }
        },
        fail: e => {
          this.formLoading = false
          this.$toasted.error(this.$t('reset.TOKEN_ERROR'))
        },
        overrideErrors: true
      })
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
    captchaVerify: function (response) {
      this.captchaKey = response
      this.captchaExpired = false
    },
    captchaExpiry: function () {
      this.captchaKey = null
      this.captchaExpired = true
    }
  }
}
</script>
