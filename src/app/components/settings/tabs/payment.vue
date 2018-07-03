<template>
  <div>
    <div class="grid-container">
      <div class="grid-title">
        <h2>Payment Details</h2>
      </div>

      <div
        v-if="$route.params.fromInvoice"
        class="message message-warning col-12 mb-3">
        <div>
          <h5>{{ $i18n.t('invoices.MISSING_PAYMENT_INFORMATION') }}</h5>
          <p>{{ $i18n.t('invoices.MISSING_PAYMENT_INFORMATION_TEXT') }}</p>
          <p class="actions">
            <router-link
              :to="{ name: 'stripe', params: { invoiceId: $route.params.fromInvoice } }"
              class="button-info">
              {{ $i18n.t('invoices.COMPLETE_PAYMENT') }}
            </router-link>
          </p>
        </div>
      </div>

      <div class="col-8">
        <form @submit.prevent.stop="submit">
          <h3>Billing Address</h3>
          <div
            v-if="formError"
            class="message message-error">{{ formError }}</div>

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
              class="input-error-message">
              {{ errors.first('name') }}
            </span>
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
              class="input-error-message">
              {{ errors.first('phone_no') }}
            </span>
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
              class="input-error-message">
              {{ errors.first('organization') }}
            </span>
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
              class="input-error-message">
              {{ errors.first('address_line_1') }}
            </span>
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
              class="input-error-message">
              {{ errors.first('address_line_2') }}
            </span>
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
                class="input-error-message">
                {{ errors.first('city') }}
              </span>
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
                class="input-error-message">
                {{ errors.first('state') }}
              </span>
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
                class="input-error-message">
                {{ errors.first('post_code') }}
              </span>
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
              class="input-error-message">
              {{ errors.first('tax_identification') }}
            </span>
          </div>

          <button
            :class="{ 'button-loading': formLoading }"
            :disabled="formLoading"
            type="submit"
            class="button-info button-md max-width">
            Update Billing Address
          </button>
        </form>
      </div>

      <div class="col-4">
        <h3>Payment Methods</h3>
        <saved-cards :user="user"/>
        <credits :user="user"/>
        <promo-codes :user="user"/>
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
  components: {
    savedCards,
    credits,
    promoCodes
  },
  metaInfo: {
    title: 'Payment Details'
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    formError: {
      type: String,
      required: true
    },
    formLoading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: null
    }
  },
  computed: {
    ...mapGetters({
      rules: 'appUsers/editRules',
      countries: 'settings/countries'
    })
  },
  created () {
    this.form = Object.assign({}, this.user)

    // Default country: USA
    if (!this.form.country) {
      this.form.country = this.countries[0].code
    }
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
  }
}
</script>
