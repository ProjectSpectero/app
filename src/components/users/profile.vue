<template>
  <div>
    <form @submit.prevent.stop="submit">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <h2>General information</h2>

      <div class="form-input">
        <input
          type="text"
          v-model="form.name"
          name="name"
          placeholder="Name"
          class="input max-width"
          :class="{'input-error': errors.has('name')}"
          :disabled="formDisable"
          v-validate="'required'"
          data-vv-as="name">

        <span v-show="errors.has('name')" class="input-error-message">
          {{ errors.first('name') }}
        </span>
      </div>

      <div class="form-input">
        <input
          type="email"
          v-model="form.email"
          name="email"
          placeholder="Email"
          class="input max-width"
          :class="{'input-error': errors.has('email')}"
          :disabled="formDisable"
          v-validate="'required|email'"
          data-vv-as="email">

        <span v-show="errors.has('email')" class="input-error-message">
          {{ errors.first('email') }}
        </span>
      </div>

      <h2>Billing details</h2>

      <div class="form-input">
        <input
          type="text"
          v-model="form.address_line_1"
          name="address_line_1"
          placeholder="Address"
          class="input max-width"
          :class="{'input-error': errors.has('address_line_1')}"
          :disabled="formDisable"
          v-validate="'required'"
          data-vv-as="address_line_1">

        <span v-show="errors.has('address_line_1')" class="input-error-message">
          {{ errors.first('address_line_1') }}
        </span>
      </div>

      <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
        {{ formDisable ? 'Please Wait' : 'Save' }}
      </button>
    </form>
  </div>
</template>

<script>
import user from '@/api/user.js'

export default {
  props: {
    user: Object
  },
  data () {
    return {
      formError: null,
      formDisable: false,
      form: null
    }
  },
  created () {
    console.log(this.user)
    this.form = JSON.parse(JSON.stringify(this.user))
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          this.formDisable = true

          user.edit({
            data: {
              id: this.user.id,
              name: this.form.name,
              email: this.form.email
            },
            success: response => {
              this.dealWithSuccess()
            },
            fail: error => {
              this.dealWithError(error)
            }
          })
        }
      })
    },
    dealWithSuccess () {
      this.$toasted.show('Profile updated!')
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
