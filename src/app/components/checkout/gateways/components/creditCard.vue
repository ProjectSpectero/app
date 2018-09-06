<template>
  <div>
    <div
      v-if="!paid"
      class="cc-form">
      <div
        v-if="formError"
        class="message message-error">{{ formError }}</div>

      <div class="form-input col-container reduce-spacing billing-fields">
        <div class="col">
          <float-label>
            <input
              v-validate="rules.name"
              v-model="customerData.customer_name"
              :disabled="loading || disableBillingFields"
              :class="{'input-error': errors.has('name')}"
              type="text"
              name="name"
              placeholder="Your Name"
              class="input"
              data-vv-as="name">
          </float-label>

          <span
            v-show="errors.has('name')"
            class="input-error-message"
            v-html="errors.first('name')"/>
        </div>
        <div class="col">
          <float-label>
            <input
              v-validate="rules.zip"
              v-model="customerData.post_code"
              :disabled="loading || disableBillingFields"
              :class="{'input-error': errors.has('zip')}"
              type="text"
              name="zip"
              placeholder="Zip/Postal Code"
              class="input"
              data-vv-as="zip">
          </float-label>

          <span
            v-show="errors.has('zip')"
            class="input-error-message"
            v-html="errors.first('zip')"/>
        </div>
        <div v-if="disableBillingFields">
          <router-link
            :to="{ name: 'settings', params: { tab: 'payment' }, query: { continueCcPayment: invoice.id } }"
            class="button">
            Edit
          </router-link>
        </div>
      </div>

      <div class="card-container">
        <card
          :stripe="stripeKey"
          :options="stripeCardOptions"
          class="stripe-card"
        />
        <div
          v-if="loading"
          class="card-overlay"/>
      </div>
      <div class="label mt-3">
        <p-input
          id="cc-save"
          v-model="saveCard"
          class="p-default p-curve"
          type="checkbox"
          color="success">
          {{ $t('payments.CHECK_SAVE_CARD') }}
        </p-input>
      </div>

      <p class="order-total">
        Order Total: <span class="amount">{{ due.amount | currency }} {{ due.currency }}</span>
      </p>

      <button
        :disabled="loading"
        :class="{'button-loading': loading}"
        class="button-lg button-success button-pay"
        @click.stop="pay">
        {{ $t('payments.BUTTON_PAY_NOW') }}
      </button>

      <p class="order-secure">
        <span class="icon-lock"/> {{ $t('payments.PAY_SECURE') }}
        <span
          v-tooltip="$t('payments.PAY_SECURE_DETAILS')"
          class="tooltip-text-trigger">
          {{ $t('misc.LEARN_MORE') }} &raquo;
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/app/api/payment'

export default {
  components: {
    Card
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    due: {
      type: Object,
      required: true
    },
    customer: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      formError: null,
      paid: false,
      customerData: {},
      customerComplete: false,
      disableBillingFields: false,
      saveCard: true,
      stripeCardOptions: { // https://stripe.com/docs/stripe.js#element-options
        hidePostalCode: true
      },
      rules: {
        name: {
          required: true,
          max: 50
        },
        zip: {
          required: true,
          max: 10
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    stripeKey () {
      return (process.env.VUE_APP_STRIPE_MODE === 'live') ? process.env.VUE_APP_STRIPE_LIVE_PUBLIC_KEY : process.env.VUE_APP_STRIPE_SANDBOX_PUBLIC_KEY
    }
  },
  async created () {
    this.customerData = Object.assign({}, this.customer.data)
    this.customerComplete = this.customer.complete
    this.disableBillingFields = (this.customerData.customer_name && this.customerData.post_code)
  },
  methods: {
    pay () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$t(`errors.VALIDATION_FAILED`)
        } else {
          this.loading = true
          this.formError = null

          // Format customer data for Stripe's format
          const stripeCustomer = {
            name: this.customerData.customer_name,
            address_line1: this.customerData.address_line_1,
            address_line2: this.customerData.address_line_2 || '',
            address_city: this.customerData.city,
            address_state: this.customerData.state,
            address_zip: this.customerData.post_code,
            address_country: this.customerData.country
          }

          // Issue Stripe customer token
          createToken(stripeCustomer).then(stripeResponse => {
            if (stripeResponse.error) {
              this.formError = this.$t('payments.STRIPE_ERROR', { msg: stripeResponse.error.message })
              this.loading = false
            } else {
              this.formError = null

              // Process stripe payment on our API
              this.processStripe(stripeResponse)
            }
          }).catch((e) => {
            this.formError = this.$t('misc.UNKNOWN_ERROR')
            this.loading = false
            console.error('Error while creating Stripe token', e)
          })
        }
      })
    },
    processStripe (stripeData) {
      paymentAPI.processStripe({
        data: {
          invoiceId: this.invoice.id,
          stripeToken: stripeData.token.id,
          save: this.saveCard
        },
        success: async processResponse => {
          this.paid = true
          this.$emit('paymentComplete')
        },
        fail: error => {
          this.loading = false
          this.formError = this.errorAPI(error, 'payments')
          console.error('Stripe process error', error)
        },
        overrideErrors: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  position: relative;

  .card-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.6);
  }
}
.order-secure {
  margin-top: $pad;
  opacity: 0.5;
}
</style>
