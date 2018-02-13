<template>
  <form @submit="test" method="post">
    <stripe-checkout
      :stripe-key="stripeKey"
      :product="product"
      on-success="broadcast">
    </stripe-checkout>
  </form>
</template>

<script>
import { StripeCheckout } from 'vue-stripe'

// Workflow:
// 1) On click, call /order (API)
// 2) Receive the data for the new order
// 3) Call /invoice/self
// 4) Now we can use stripe with the info

export default {
  data () {
    return {
      product: {
        name: 'Spectero',
        description: 'Spectero purchase',
        amount: 100000
      }
    }
  },
  computed: {
    stripeKey () {
      console.log(process.env.STRIPE_MODE)
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  methods: {
    test () {
      console.log('here')
    }
  },
  components: {
    StripeCheckout
  }
}
</script>
