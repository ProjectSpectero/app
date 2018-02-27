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
            v-validate="rules['email']"
            data-vv-as="email">

          <span v-show="errors.has('email')" class="input-error-message">
            {{ errors.first('email') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="password">Password</label></div>
          <input
            type="password"
            v-model="form.password"
            name="password"
            id="password"
            placeholder="Password (leave blank to keep the current one)"
            class="input max-width"
            :class="{'input-error': errors.has('password')}"
            :disabled="formDisable"
            v-validate="rules['password']"
            data-vv-as="password">

          <span v-show="errors.has('password')" class="input-error-message">
            {{ errors.first('password') }}
          </span>
        </div>
      </div>

      <div class="container">
        <div class="message error" v-if="formError">{{ formError }}</div>

        <h2>Node configuration</h2>

        <div class="form-input">
          <button class="button" @click.prevent.stop="regenerateNodeKey">Regenerate node key</button>
          <p v-if="nodeKey" class="mt-3">Your node key was set to <strong>{{ nodeKey }}</strong>.</p>
        </div>
      </div>

      <payment-methods :user="user"></payment-methods>

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
            v-validate="rules['name']"
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
            v-validate="rules['address_line_1']"
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
            v-validate="rules['address_line_2']"
            data-vv-as="address_line_2">

          <span v-show="errors.has('address_line_2')" class="input-error-message">
            {{ errors.first('address_line_2') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="city">City</label></div>
          <input
            type="text"
            v-model="form.city"
            name="city"
            id="city"
            placeholder="City"
            class="input max-width"
            :class="{'input-error': errors.has('city')}"
            :disabled="formDisable"
            v-validate="rules['city']"
            data-vv-as="city">

          <span v-show="errors.has('city')" class="input-error-message">
            {{ errors.first('city') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="state">State</label></div>
          <input
            type="text"
            v-model="form.state"
            name="state"
            id="state"
            placeholder="State"
            class="input max-width"
            :class="{'input-error': errors.has('state')}"
            :disabled="formDisable"
            v-validate="rules['state']"
            data-vv-as="state">

          <span v-show="errors.has('state')" class="input-error-message">
            {{ errors.first('state') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="post_code">Postal Code</label></div>
          <input
            type="text"
            v-model="form.post_code"
            name="post_code"
            id="post_code"
            placeholder="Postal Code"
            class="input max-width"
            :class="{'input-error': errors.has('post_code')}"
            :disabled="formDisable"
            v-validate="rules['post_code']"
            data-vv-as="post_code">

          <span v-show="errors.has('post_code')" class="input-error-message">
            {{ errors.first('post_code') }}
          </span>
        </div>

        <div v-if="form.country" class="form-input">
          <div class="label"><label for="country">Country</label></div>

          <select v-model="form.country">
            <option v-for="country in countries" :key="country.code">
              {{ country.name }}
            </option>
          </select>
        </div>

        <div class="form-input">
          <div class="label"><label for="phone_no">Phone Number</label></div>
          <input
            type="text"
            v-model="form.phone_no"
            name="phone_no"
            id="phone_no"
            placeholder="Phone Number"
            class="input max-width"
            :class="{'input-error': errors.has('phone_no')}"
            :disabled="formDisable"
            v-validate="rules['phone_no']"
            data-vv-as="phone_no">

          <span v-show="errors.has('phone_no')" class="input-error-message">
            {{ errors.first('phone_no') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="tax_identification">Tax Identification Number</label></div>
          <input
            type="text"
            v-model="form.tax_identification"
            name="tax_identification"
            id="tax_identification"
            placeholder="Tax Identification Number"
            class="input max-width"
            :class="{'input-error': errors.has('tax_identification')}"
            :disabled="formDisable"
            v-validate="rules['tax_identification']"
            data-vv-as="tax_identification">

          <span v-show="errors.has('tax_identification')" class="input-error-message">
            {{ errors.first('tax_identification') }}
          </span>
        </div>

        <div class="form-input">
          <div class="label"><label for="organization">Organization</label></div>
          <input
            type="text"
            v-model="form.organization"
            name="organization"
            id="organization"
            placeholder="Organization"
            class="input max-width"
            :class="{'input-error': errors.has('organization')}"
            :disabled="formDisable"
            v-validate="rules['organization']"
            data-vv-as="organization">

          <span v-show="errors.has('organization')" class="input-error-message">
            {{ errors.first('organization') }}
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
import { mapGetters } from 'vuex'
import userAPI from '@/api/user.js'
import paymentMethods from './settingsPaymentMethods'

export default {
  data () {
    return {
      formError: null,
      formDisable: false,
      changedEmail: false,
      form: null,
      nodeKey: null
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.user))

    // Default country: USA
    if (!this.form.country) {
      this.form.country = this.countries[0].name
    } else {
      let currentCountry = this.countries.find(c => c.code === this.form.country)
      this.form.country = currentCountry.name
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      rules: 'users/editRules',
      countries: 'settings/countries'
    })
  },
  methods: {
    regenerateNodeKey () {
      userAPI.regenerateNodeKey({
        success: response => {
          this.nodeKey = response.data.result.node_key
        },
        fail: error => {
          console.log('Unable to regenerate node key', error)
        }
      })
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          if (this.userAPI.email === this.form.email) {
            this.changedEmail = false
            this.processForm()
          } else if (this.userAPI.email !== this.form.email &&
            confirm(this.$i18n.t('CHANGE_EMAIL_DIALOG', { oldEmail: this.userAPI.email, newEmail: this.form.email }))) {
            this.changedEmail = true
            this.processForm()
          }
        }
      })
    },
    logMeOut () {
      this.logout().then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    processForm () {
      const country = this.countries.find(c => c.name === this.form.country)
      let data = JSON.parse(JSON.stringify(this.form))

      // Remove empty fields from the list
      for (var key in data) {
        if (data[key] === null || data[key] === '') {
          delete data[key]
        }
      }

      // Format special fields
      data.id = this.userAPI.id
      data.country = country.code

      this.formDisable = true

      userAPI.edit({
        data: data,
        success: response => {
          this.dealWithSuccess()
        },
        fail: error => {
          this.dealWithError(error)
        }
      })
    },
    dealWithSuccess () {
      this.$toasted.show('Your profile has been updated successfully!')
      this.formDisable = false

      // Changing the email requires re-validation + logging in again
      if (this.changedEmail) {
        this.logMeOut()
      }
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
          console.log(inputErrors)
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
  components: {
    paymentMethods
  }
}
</script>
