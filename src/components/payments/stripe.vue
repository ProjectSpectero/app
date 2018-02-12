<template>
  <form action="/process-payment" method="post">
    <stripe-checkout
      :stripe-key="stripeKey"
      product="product">
    </stripe-checkout>
  </form>
</template>

<script>
import { StripeCheckout } from 'vue-stripe'

export default {
  computed: {
    stripeKey () {
      console.log(process.env.STRIPE_MODE)
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  components: {
    StripeCheckout
  }
}
</script>
