<template>
  <div>
    <div v-if="finished">
      Payment processed successfully!
    </div>
    <div v-else>
      <card class="stripe-card"
        :stripe="stripeKey"
        :options="stripeOptions"
        @change="setProcessedStatus($event.complete)"
      />
      <button @click="pay" :disabled="!processed">Pay with credit card</button>
    </div>
  </div>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/api/payment.js'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      status: '',
      processed: false,
      finished: false,
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
      console.log(process.env.STRIPE_MODE)
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  methods: {
    // The workflow for payments with Stripe works as follows:
    // 1) We create an (unpaid) order through the API
    // 2) We issue an invoice for that order
    // 3) If things work as intended, we'll process the payment with Stripe
    // 4) We handle the payment success token with the API
    // 5) If everything goes well, the payment process is complete
    pay () {
      // Getting a dummy invoice for now
      paymentAPI.invoices({
        success: invoices => {
          console.log(invoices)
          if (invoices.data.result) {
            const dummyInvoice = invoices.data.result[0]

            // Stripe token issued
            createToken().then(stripeData => {
              // Process stripe payment on our API
              paymentAPI.processStripe({
                data: {
                  invoiceId: dummyInvoice.id,
                  stripeToken: stripeData.token.id,
                  save: true
                },
                success: processResponse => {
                  console.log(processResponse)

                  paymentAPI.invoices({
                    success: invoicesResponse => {
                      console.log(invoicesResponse)
                      this.finished = true
                    },
                    fail: error => this.showError(error)
                  })
                },
                fail: error => this.showError(error)
              })
            })
          }
        },
        fail: error => this.showError(error)
      })
    },
    showError (error) {
      const keys = Object.keys(error.errors)
      this.errorMessage = this.$i18n.t(`errors.${keys[0]}`)
      this.status = 'error'
      this.finished = false
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
