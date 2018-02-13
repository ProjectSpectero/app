<template>
  <div>
    <card class='stripe-card'
      :class='{ complete }'
      :stripe="stripeKey"
      :options='stripeOptions'
      @change='toggleStatus($event.complete)'
    />
    <button class='pay-with-stripe' @click='pay' :disabled='!complete'>Pay with credit card</button>
  </div>
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

// Workflow:
// 1) On click, call /order (API)
// 2) Receive the data for the new order
// 3) Call /invoice/self
// 4) Now we can use stripe with the info

export default {
  data () {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
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
    pay () {
      createToken().then(data => console.log(data.token))
    },
    toggleStatus (status) {
      this.complete = status
    }
  },
  components: {
    Card
  }
}
</script>

<style>
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>
