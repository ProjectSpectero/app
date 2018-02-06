<template>
  <div>
    <form @submit.prevent.stop="submit">
      <div class="container">
        <div class="message error" v-if="formError">{{ formError }}</div>

        <h2>General Information</h2>

        <div class="form-input">
          <div class="label"><label for="email">Email</label></div>
          <input
            type="email"
            v-model="form.email"
            name="email"
            id="email"
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
      </div>

      <div class="container">

        <h2>Billing Details</h2>

        <div class="form-input">
          <div class="label"><label for="name">Full Name</label></div>
          <input
            type="text"
            v-model="form.name"
            name="name"
            id="name"
            placeholder="Full Name"
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
          <div class="label"><label for="address_line_1">Address Line 1</label></div>
          <input
            type="text"
            v-model="form.address_line_1"
            name="address_line_1"
            id="address_line_1"
            placeholder="Address Line 1"
            class="input max-width"
            :class="{'input-error': errors.has('address_line_1')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_line_1">

          <span v-show="errors.has('address_line_1')" class="input-error-message">
            {{ errors.first('address_line_1') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_line_2">Address Line 2</label></div>
          <input
            type="text"
            v-model="form.address_line_2"
            name="address_line_2"
            id="address_line_2"
            placeholder="Address Line 2"
            class="input max-width"
            :class="{'input-error': errors.has('address_line_2')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_line_2">

          <span v-show="errors.has('address_line_2')" class="input-error-message">
            {{ errors.first('address_line_2') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_city">City</label></div>
          <input
            type="text"
            v-model="form.address_city"
            name="address_city"
            id="address_city"
            placeholder="City"
            class="input max-width"
            :class="{'input-error': errors.has('address_city')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_city">

          <span v-show="errors.has('address_city')" class="input-error-message">
            {{ errors.first('address_city') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_state">State</label></div>
          <input
            type="text"
            v-model="form.address_state"
            name="address_state"
            id="address_state"
            placeholder="State"
            class="input max-width"
            :class="{'input-error': errors.has('address_state')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_state">

          <span v-show="errors.has('address_state')" class="input-error-message">
            {{ errors.first('address_state') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_post_code">Postal Code</label></div>
          <input
            type="text"
            v-model="form.address_post_code"
            name="address_post_code"
            id="address_post_code"
            placeholder="Postal Code"
            class="input max-width"
            :class="{'input-error': errors.has('address_post_code')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_post_code">

          <span v-show="errors.has('address_post_code')" class="input-error-message">
            {{ errors.first('address_post_code') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_country">Country</label></div>
          <input
            type="text"
            v-model="form.address_country"
            name="address_country"
            id="address_country"
            placeholder="Country"
            class="input max-width"
            :class="{'input-error': errors.has('address_country')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_country">

          <span v-show="errors.has('address_country')" class="input-error-message">
            {{ errors.first('address_country') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_phone">Phone Number</label></div>
          <input
            type="text"
            v-model="form.address_phone"
            name="address_phone"
            id="address_phone"
            placeholder="Phone Number"
            class="input max-width"
            :class="{'input-error': errors.has('address_phone')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_phone">

          <span v-show="errors.has('address_phone')" class="input-error-message">
            {{ errors.first('address_phone') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_tax_number">Tax Identification Number</label></div>
          <input
            type="text"
            v-model="form.address_tax_number"
            name="address_tax_number"
            id="address_tax_number"
            placeholder="Tax Identification Number"
            class="input max-width"
            :class="{'input-error': errors.has('address_tax_number')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_tax_number">

          <span v-show="errors.has('address_tax_number')" class="input-error-message">
            {{ errors.first('address_tax_number') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="address_organization">Organization</label></div>
          <input
            type="text"
            v-model="form.address_organization"
            name="address_organization"
            id="address_organization"
            placeholder="Organization"
            class="input max-width"
            :class="{'input-error': errors.has('address_organization')}"
            :disabled="formDisable"
            v-validate="'required'"
            data-vv-as="address_organization">

          <span v-show="errors.has('address_tax_number')" class="input-error-message">
            {{ errors.first('address_tax_number') }}
          </span>
        </div>

        <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
          {{ formDisable ? 'Please Wait' : 'Save' }}
        </button>
      </div>

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
