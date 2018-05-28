<template>
  <div>
    <h2>Payment Details</h2>
    <div class="grid-container">

      <div class="col-6">
        <form @submit.prevent.stop="submit">
          <h3>Billing Address</h3>
          <div class="message message-error" v-if="formError">{{ formError }}</div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.name"
                name="name"
                id="name"
                placeholder="Full Name"
                class="input max-width"
                :class="{'input-error': errors.has('name')}"
                :disabled="formLoading"
                v-validate="rules['name']"
                data-vv-as="name">
            </float-label>

            <span v-show="errors.has('name')" class="input-error-message">
              {{ errors.first('name') }}
            </span>
          </div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.phone_no"
                name="phone_no"
                id="phone_no"
                placeholder="Phone Number"
                class="input max-width"
                :class="{'input-error': errors.has('phone_no')}"
                :disabled="formLoading"
                v-validate="rules['phone_no']"
                data-vv-as="phone_no">
            </float-label>

            <span v-show="errors.has('phone_no')" class="input-error-message">
              {{ errors.first('phone_no') }}
            </span>
          </div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.organization"
                name="organization"
                id="organization"
                placeholder="Company Name"
                class="input max-width"
                :class="{'input-error': errors.has('organization')}"
                :disabled="formLoading"
                v-validate="rules['organization']"
                data-vv-as="organization">
            </float-label>

            <span v-show="errors.has('organization')" class="input-error-message">
              {{ errors.first('organization') }}
            </span>
          </div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.address_line_1"
                name="address_line_1"
                id="address_line_1"
                placeholder="Address Line 1"
                class="input max-width"
                :class="{'input-error': errors.has('address_line_1')}"
                :disabled="formLoading"
                v-validate="rules['address_line_1']"
                data-vv-as="address_line_1">
            </float-label>

            <span v-show="errors.has('address_line_1')" class="input-error-message">
              {{ errors.first('address_line_1') }}
            </span>
          </div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.address_line_2"
                name="address_line_2"
                id="address_line_2"
                placeholder="Address Line 2"
                class="input max-width"
                :class="{'input-error': errors.has('address_line_2')}"
                :disabled="formLoading"
                v-validate="rules['address_line_2']"
                data-vv-as="address_line_2">
            </float-label>

            <span v-show="errors.has('address_line_2')" class="input-error-message">
              {{ errors.first('address_line_2') }}
            </span>
          </div>

          <div class="form-input col-container reduce-spacing">
            <div class="col">
              <float-label>
                <input
                  type="text"
                  v-model="form.city"
                  name="city"
                  id="city"
                  placeholder="City"
                  class="input max-width"
                  :class="{'input-error': errors.has('city')}"
                  :disabled="formLoading"
                  v-validate="rules['city']"
                  data-vv-as="city">
              </float-label>

              <span v-show="errors.has('city')" class="input-error-message">
                {{ errors.first('city') }}
              </span>
            </div>
            <div class="col">
              <float-label>
                <input
                  type="text"
                  v-model="form.state"
                  name="state"
                  id="state"
                  placeholder="State"
                  class="input max-width"
                  :class="{'input-error': errors.has('state')}"
                  :disabled="formLoading"
                  v-validate="rules['state']"
                  data-vv-as="state">
              </float-label>

              <span v-show="errors.has('state')" class="input-error-message">
                {{ errors.first('state') }}
              </span>
            </div>
          </div>

          <div class="form-input col-container reduce-spacing">
            <div class="col">
              <float-label>
                <input
                  type="text"
                  v-model="form.post_code"
                  name="post_code"
                  id="post_code"
                  placeholder="Postal Code"
                  class="input max-width"
                  :class="{'input-error': errors.has('post_code')}"
                  :disabled="formLoading"
                  v-validate="rules['post_code']"
                  data-vv-as="post_code">
              </float-label>

              <span v-show="errors.has('post_code')" class="input-error-message">
                {{ errors.first('post_code') }}
              </span>
            </div>
            <div class="col">
              <float-label label="Country">
                <select v-model="form.country" :disabled="formLoading">
                  <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.name }}
                  </option>
                </select>
              </float-label>
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                type="text"
                v-model="form.tax_identification"
                name="tax_identification"
                id="tax_identification"
                placeholder="Tax Identification Number"
                class="input max-width"
                :class="{'input-error': errors.has('tax_identification')}"
                :disabled="formLoading"
                v-validate="rules['tax_identification']"
                data-vv-as="tax_identification">
            </float-label>

            <span v-show="errors.has('tax_identification')" class="input-error-message">
              {{ errors.first('tax_identification') }}
            </span>
          </div>

          <button type="submit" class="button button-info button-md max-width" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
            Update Billing Address
          </button>
        </form>
      </div>

      <div class="col-4">
        <h3>Payment Methods</h3>
        <saved-cards :user="user"></saved-cards>
        <credits :user="user"></credits>
        <promo-codes :user="user"></promo-codes>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import savedCards from '../components/savedCards'
import credits from '../components/credits'
import promoCodes from '../components/promoCodes'

export default {
  props: {
    user: Object,
    formError: String,
    formLoading: Boolean,
    processForm: Function
  },
  metaInfo: {
    title: 'Payment Details'
  },
  data () {
    return {
      form: null
    }
  },
  created () {
    this.form = Object.assign({}, this.user)

    // Default country: USA
    if (!this.form.country) {
      this.form.country = this.countries[0].code
    }
  },
  computed: {
    ...mapGetters({
      rules: 'appUsers/editRules',
      countries: 'settings/countries'
    })
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          this.formError = this.$i18n.t('errors.VALIDATION_FAILED')
        } else {
          this.$emit('processForm', this.form)
        }
      })
    }
  },
  components: {
    savedCards,
    credits,
    promoCodes
  }
}
</script>
