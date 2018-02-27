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
</template>

<script>
import { mapActions } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/api/payment.js'

export default {
  props: {
    invoiceId: Number
  },
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
  computed: {
    stripeKey () {
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'users/setPendingInvoiceStatus'
    }),
    pay () {
      // Stripe token issued
      createToken().then(stripeData => {
        // Process stripe payment on our API
        this.processStripe(this.invoiceId, stripeData)
      })
    },
    processStripe (invoiceId, stripeData) {
      paymentAPI.processStripe({
        data: {
          invoiceId: invoiceId,
          stripeToken: stripeData.token.id,
          save: (this.saveCard === '1') || false
        },
        success: async processResponse => {
          await this.setPendingInvoiceStatus(true)
          this.$router.push({ name: 'invoice', params: { id: invoiceId } })
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
  },
  components: {
    Card
  }
}
</script>
