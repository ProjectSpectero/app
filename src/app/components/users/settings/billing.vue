<template>
  <form @submit.prevent.stop="submit">
    <h3>Billing Address</h3>

    <div
      v-if="formError"
      class="message is-danger">{{ formError }}</div>

    <div
      v-else-if="form.continueCcPayment || needsBillingUpdate"
      class="message is-info mb-4"
      v-html="$t('invoices.BILLING_ADDRESS_CONTINUE_PAYMENT')"/>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.name"
          id="name"
          v-model="form.name"
          :class="{'input-error': errors.has('name')}"
          :disabled="formLoading"
          type="text"
          name="name"
          placeholder="Full Name"
          class="input max-width"
          data-vv-as="name">
      </float-label>

      <span
        v-show="errors.has('name')"
        class="input-error-message"
        v-html="errors.first('name')"/>
    </div>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.phone_no"
          id="phone_no"
          v-model="form.phone_no"
          :class="{'input-error': errors.has('phone_no')}"
          :disabled="formLoading"
          type="text"
          name="phone_no"
          placeholder="Phone Number"
          class="input max-width"
          data-vv-as="phone_no">
      </float-label>

      <span
        v-show="errors.has('phone_no')"
        class="input-error-message"
        v-html="errors.first('phone_no')"/>
    </div>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.organization"
          id="organization"
          v-model="form.organization"
          :class="{'input-error': errors.has('organization')}"
          :disabled="formLoading"
          type="text"
          name="organization"
          placeholder="Company Name"
          class="input max-width"
          data-vv-as="organization">
      </float-label>

      <span
        v-show="errors.has('organization')"
        class="input-error-message"
        v-html="errors.first('organization')"/>
    </div>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.address_line_1"
          id="address_line_1"
          v-model="form.address_line_1"
          :class="{'input-error': errors.has('address_line_1')}"
          :disabled="formLoading"
          type="text"
          name="address_line_1"
          placeholder="Address Line 1"
          class="input max-width"
          data-vv-as="address_line_1">
      </float-label>

      <span
        v-show="errors.has('address_line_1')"
        class="input-error-message"
        v-html="errors.first('address_line_1')"/>
    </div>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.address_line_2"
          id="address_line_2"
          v-model="form.address_line_2"
          :class="{'input-error': errors.has('address_line_2')}"
          :disabled="formLoading"
          type="text"
          name="address_line_2"
          placeholder="Address Line 2"
          class="input max-width"
          data-vv-as="address_line_2">
      </float-label>

      <span
        v-show="errors.has('address_line_2')"
        class="input-error-message"
        v-html="errors.first('address_line_2')"/>
    </div>

    <div class="form-input col-container reduce-spacing">
      <div class="col">
        <float-label>
          <input
            v-validate="rules.city"
            id="city"
            v-model="form.city"
            :class="{'input-error': errors.has('city')}"
            :disabled="formLoading"
            type="text"
            name="city"
            placeholder="City"
            class="input max-width"
            data-vv-as="city">
        </float-label>

        <span
          v-show="errors.has('city')"
          class="input-error-message"
          v-html="errors.first('city')"/>
      </div>
      <div class="col">
        <float-label>
          <input
            v-validate="rules.state"
            id="state"
            v-model="form.state"
            :class="{'input-error': errors.has('state')}"
            :disabled="formLoading"
            type="text"
            name="state"
            placeholder="State"
            class="input max-width"
            data-vv-as="state">
        </float-label>

        <span
          v-show="errors.has('state')"
          class="input-error-message"
          v-html="errors.first('state')"/>
      </div>
    </div>

    <div class="form-input col-container reduce-spacing">
      <div class="col">
        <float-label>
          <input
            v-validate="rules.post_code"
            id="post_code"
            v-model="form.post_code"
            :class="{'input-error': errors.has('post_code')}"
            :disabled="formLoading"
            type="text"
            name="post_code"
            placeholder="Postal Code"
            class="input max-width"
            data-vv-as="post_code">
        </float-label>

        <span
          v-show="errors.has('post_code')"
          class="input-error-message"
          v-html="errors.first('post_code')"/>
      </div>
      <div class="col">
        <float-label label="Country">
          <select
            v-model="form.country"
            :disabled="formLoading">
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code">
              {{ country.name }}
            </option>
          </select>
        </float-label>
      </div>
    </div>

    <div class="form-input">
      <float-label>
        <input
          v-validate="rules.tax_identification"
          id="tax_identification"
          v-model="form.tax_identification"
          :class="{'input-error': errors.has('tax_identification')}"
          :disabled="formLoading"
          type="text"
          name="tax_identification"
          placeholder="Tax Identification Number"
          class="input max-width"
          data-vv-as="tax_identification">
      </float-label>

      <span
        v-show="errors.has('tax_identification')"
        class="input-error-message"
        v-html="errors.first('tax_identification')"/>
    </div>

    <button
      :class="{ 'is-loading': formLoading }"
      :disabled="formLoading"
      type="submit"
      class="button is-info is-medium max-width">
      Update Billing Address
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import userAPI from '@/app/api/user'

export default {
  components: {

  },
  props: {
    needsBillingUpdate: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      form: null,
      formError: null,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      rules: 'appUsers/editRules',
      countries: 'settings/countries'
    })
  },
  created () {
    this.form = Object.assign({}, this.user)
    this.form.continueCcPayment = this.$route.query.continueCcPayment

    // Default country: USA
    if (!this.form.country) {
      this.form.country = this.countries[0].code
    }
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$t('errors.VALIDATION_FAILED')
        } else {
          this.formError = null
          this.process()
        }
      })
    },
    async process () {
      this.formLoading = true

      let submitForm = this.form

      // Remove empty fields from the list
      for (var key in submitForm) {
        if (submitForm[key] === null) {
          delete submitForm[key]
        }
      }

      userAPI.edit({
        data: submitForm,
        success: async response => {
          await this.syncCurrentUser()

          if (this.form.continueCcPayment) {
            this.$router.push({ name: 'checkout', params: { id: this.form.continueCcPayment }, query: { continueCc: true } })
          }

          this.$emit('billingProfileUpdated')
          this.$toasted.success('Your account has been updated successfully.')
          this.formLoading = false
        },
        fail: error => {
          this.formLoading = false

          // Get first error key to display main error msg
          for (var errorKey in error.errors) {
            if (error.errors.hasOwnProperty(errorKey)) {
              this.formError = this.$t(`errors.${errorKey}`)
              break
            }
          }

          // Inject errors into form fields
          for (let inputName in error.fields) {
            if (error.fields.hasOwnProperty(inputName)) {
              let inputErrors = error.fields[inputName]
              console.log(inputErrors)
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
        }
      })
    },
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>
