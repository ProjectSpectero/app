<template>
  <div v-if="!error">
    <div v-if="!loading">
      Payment processed successfully!
    </div>
    <div v-else>
      <card class="stripe-card"
        :stripe="stripeKey"
        :options="stripeOptions"
        @change="setProcessedStatus($event.complete)"
      />
      <button @click="pay" :disabled="!processed">Pay with credit card</button>

      <label>
        <input type="checkbox" v-model="saveCard" true-value="1" false-value="0">
        Save card?
      </label>
    </div>
  </div>
  <div v-else>
    {{ $i18n.t(error) }}
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      status: '',
      error: null,
      processed: false,
      loading: true,
      saveCard: false,
      stripeOptions: {
        // https://stripe.com/docs/stripe.js#element-options
      }
    }
  },
  created () {
    console.log(this.user)
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    stripeKey () {
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'auth/syncCurrentUser'
    }),
    pay () {
      // Getting a dummy invoice for now
      paymentAPI.myInvoices({
        success: invoices => {
          if (invoices.data.result) {
            const invoice = invoices.data.result[0]

            // Stripe token issued
            createToken().then(stripeData => {
              // Process stripe payment on our API
              this.processStripe(invoice, stripeData)
            })
          }
        },
        fail: error => {
          this.error = this.errorAPI(error, 'payments')
          this.loading = false
        }
      })
    },
    showError (error) {
      const keys = Object.keys(error.errors)
      this.error = this.$i18n.t(`payments.${keys[0]}`)
      this.finished = false
    },
    processStripe (invoice, stripeData) {
      paymentAPI.processStripe({
        data: {
          invoiceId: invoice.id,
          stripeToken: stripeData.token.id,
          save: (this.saveCard === '1') || false
        },
        success: processResponse => {
          this.loading = false
          this.syncCurrentUser()
        },
        fail: error => {
          this.error = this.errorAPI(error, 'payments')
          this.loading = false
        }
      })
    },
    setProcessedStatus (status) {
      this.processed = status
    }
  },
  components: {
    Card
  }
}
</script>
