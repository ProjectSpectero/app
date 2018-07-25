<template>
  <div>
    <template>
      <top :title="$i18n.t('pro.MAIN_TITLE')"/>
      <div>
        <div class="container">
          <div class="col-12">
            <form>
              <div
                v-if="formError"
                class="message message-error">{{ formError }}</div>

              <div class="form-input">
                <float-label>
                  <input
                    v-validate="'required|email'"
                    v-model="email"
                    :class="{'input-error': errors.has('email')}"
                    :disabled="formLoading"
                    type="email"
                    name="email"
                    class="input"
                    placeholder="Your email address"
                    data-vv-as="email"
                    @keyup="$validator.errors.removeById('email_FIELD_UNIQUE')">
                </float-label>

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
                {{ $i18n.t('misc.CONTINUE') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import auth from '@/app/api/auth'
import top from '@/shared/components/top'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'Spectero Pro'
  },
  data () {
    return {
      email: null,
      formError: null,
      formLoading: false
    }
  },
  methods: {
    submit () {
      console.log(this.$validator)
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          // Disable form while HTTP request being made
          this.formLoading = true

          auth.registerEasy({
            data: {
              email: this.email
            },
            registerSuccess: response => {
              this.dealWithSuccess(response)
            },
            registerFailed: error => {
              this.dealWithError(error)
              console.error('Pro login failed', error)
            }
          })
        }
      })
    },
    dealWithSuccess (response) {
      this.formError = null
      console.log(`Pro login complete`, response)
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
              this.$validator.errors.add({
                id: `${inputName}_${errorKey}`,
                field: inputName,
                msg: this.$i18n.t(`errors.${inputName.toUpperCase()}_${errorKey}`, null, { x: inputErrors[errorKey] })
              })
            }
          }
        }
      }
    }
  }
}
</script>
