<template>
  <div>
    <h2>Payment Details</h2>

    <div class="col-container col-2">
      <div class="col">
        <form @submit.prevent.stop="submit">
          <h3>Billing Address</h3>
          <div class="message error" v-if="formError">{{ formError }}</div>

          <div class="form-input">
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
            <input
              type="text"
              v-model="form.organization"
              name="organization"
              id="organization"
              placeholder="Company Name"
              class="input max-width"
              :class="{'input-error': errors.has('organization')}"
              :disabled="formDisable"
              v-validate="rules['organization']"
              data-vv-as="organization">

            <span v-show="errors.has('organization')" class="input-error-message">
              {{ errors.first('organization') }}
            </span>
          </div>

          <div class="form-input">
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

          <div class="form-input col-container reduce-spacing">
            <div class="col">
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
            <div class="col">
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
          </div>

          <div class="form-input col-container reduce-spacing">
            <div class="col">
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
            <div class="col">
              <select v-model="form.country">
                <option v-for="country in countries" :key="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-input">
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

          <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
            Update Billing Address
          </button>
        </form>
      </div>

      <div class="col">
        <h3>Payment Methods</h3>
        <payment-methods :user="user"></payment-methods>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentMethods from '../components/savedCards'

export default {
  components: {
    paymentMethods
  },
  props: {
    user: Object
  },
  data () {
    return {
      formError: null,
      formDisable: null,
      form: null
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
      rules: 'users/editRules',
      countries: 'settings/countries'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
