<template>
  <div v-if="!error">
    <div v-if="!loading">
      {{ $i18n.t('payments.PAYMENT_SUCCESS') }}
    </div>
    <div v-else>
      <card
        :stripe="stripeKey"
        :options="stripeOptions"
        class="stripe-card"
        @change="setProcessedStatus($event.complete)"
      />
      <div class="label label-save-cc">
        <label for="cc-save">
          <input
            id="cc-save"
            v-model="saveCard"
            type="checkbox"
            true-value="1"
            false-value="0">
          {{ $i18n.t('payments.CHECK_SAVE_CARD') }}
        </label>
      </div>

      <button
        v-if="!paid"
        :disabled="!processed"
        class="button-md button-success button-full button-pay"
        @click.stop="pay">
        {{ $i18n.t('payments.BUTTON_PROCESS_PAYMENT') }}
      </button>
      <div
        v-else
        class="mt-3">{{ $i18n.t('payments.PAYMENT_PROCESSING') }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/app/api/payment'
import invoiceAPI from '@/app/api/invoice'

export default {
  components: {
    Card
  },
  props: {
    invoiceId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      status: '',
      error: null,
      invoice: null,
      paid: false,
      processed: false,
      paymentDetails: [
        'name',
        'address_line_1',
        'city',
        'state',
        'post_code',
        'country'
      ],
      saveCard: false,
      stripeOptions: {
        // https://stripe.com/docs/stripe.js#element-options
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    stripeKey () {
      return (process.env.STRIPE_MODE === 'live') ? process.env.STRIPE_LIVE_PUBLIC_KEY : process.env.STRIPE_SANDBOX_PUBLIC_KEY
    }
  },
  async created () {
    await this.fetchInvoice()
    console.log(this.invoice)
    // Is this a valid and payable invoice?
    // Then we can proceed and validate if user details
    // are correctly set (we need to send them to Stripe)
    if (this.invoice && this.invoice.status === 'UNPAID') {
      this.validateUserDetails()
    } else {
      this.fetchFailed()
    }
  },
  methods: {
    validateUserDetails () {
      let error = false

      this.paymentDetails.forEach(field => {
        console.log(this.user[field])
        if (this.user[field] === null || this.user[field] === '') {
          error = true
        }
      })

      if (error) {
        this.redirectToProfile()
      }
    },
    pay () {
      const details = {
        name: this.user.name,
        address_line1: this.user.address_line_1,
        address_line2: this.user.address_line_2 || '',
        address_city: this.user.city,
        address_state: this.user.state,
        address_zip: this.user.post_code,
        address_country: this.user.country
      }

      // Stripe token issued
      createToken(details).then(stripeData => {
        this.paid = true

        // Process stripe payment on our API
        this.processStripe(stripeData)
      }).catch((e) => {
        console.log(e)
        this.redirectToProfile()
      })
    },
    redirectToProfile () {
      this.$toasted.error(this.$i18n.t('errors.INSUFFICIENT_PAYMENT_DETAILS'))
      this.$router.push({ name: 'settings', params: { tab: 'payment', fromInvoice: this.invoiceId } })
    },
    async fetchInvoice () {
      await invoiceAPI.invoice({
        data: { id: this.invoiceId },
        success: response => {
          this.invoice = response.data.result
        },
        fail: (e) => {
          console.log(e)
        }
      })
    },
    fetchFailed () {
      this.$toasted.error(this.$i18n.t('payments.INVOICE_STATUS_MISMATCH'))
      this.$router.push({ name: 'invoices' })
    },
    processStripe (stripeData) {
      paymentAPI.processStripe({
        data: {
          invoiceId: this.invoiceId,
          stripeToken: stripeData.token.id,
          save: (this.saveCard === '1') || false
        },
        success: async processResponse => {
          this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
          this.$router.push({ name: 'invoice', params: { id: this.invoiceId } })
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'payments'))
          this.$router.push({ name: 'invoices' })
        }
      })
    },
    setProcessedStatus (status) {
      this.processed = status
    }
  }
}
</script>

<style lang="scss" scoped>
.label-save-cc {
  border-radius: 4px;
  margin: 16px 0;
}
</style>
