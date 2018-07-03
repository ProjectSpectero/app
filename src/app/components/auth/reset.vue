<template>
  <div>
    <h1>{{ $i18n.t('misc.RESET_PASSWORD') }}</h1>
    <form>
      <template v-if="tokenIssued">
        <div class="message message-success">
          {{ $i18n.t('users.RESET_TOKEN_ISSUED', { email: email }) }}
        </div>
      </template>
      <template v-else>
        <div
          v-if="formError"
          class="message message-error">{{ formError }}</div>

        <div class="form-input">
          <input
            v-validate="'required|email'"
            v-model="email"
            :placeholder="$i18n.t('users.PLACEHOLDER_EMAIL')"
            :class="{'input-error': errors.has('email')}"
            :disabled="formLoading"
            type="email"
            name="email"
            class="input max-width"
            data-vv-as="email">

          <span
            v-show="errors.has('email')"
            class="input-error-message">
            {{ errors.first('email') }}
          </span>
        </div>

        <button
          :class="{ 'button-loading': formLoading }"
          :disabled="formLoading"
          class="button-info button-md max-width"
          @click.prevent="submit"
          @keyup.enter="submit">
          {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('users.RESET_PASSWORD_BUTTON') }}
        </button>
      </template>
    </form>

    <div class="bottom-link">
      <router-link :to="{ name: 'login' }">
        {{ $i18n.t('users.BACK_TO_LOGIN') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import authAPI from '@/app/api/auth'

export default {
  metaInfo: {
    title: 'Reset password'
  },
  data () {
    return {
      email: null,
      tokenIssued: false,
      formError: null,
      formLoading: false
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          this.formLoading = true
          this.reset()
        }
      })
    },
    async reset () {
      await authAPI.askForPasswordReset({
        data: { email: this.email },
        success: response => {
          if (response.data.message && response.data.message === 'PASSWORD_RESET_TOKEN_ISSUED') {
            this.tokenIssued = true
            this.formLoading = false
          }
        },
        fail: error => {
          console.log(error)
          this.formLoading = false
          this.$toasted.error('users.RESET_TOKEN_ERROR')
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
    }
  }
}
</script>
