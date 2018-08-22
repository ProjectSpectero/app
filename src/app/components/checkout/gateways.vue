<template>
  <component
    :is="gateway"
    :invoice="invoice"
    :due="due"
    :customer="customer"
    @paymentComplete="paymentComplete"
    @updateUser="updateUser"
    @disableGateway="disableGateway"/>
</template>

<script>
import crypto from './gateways/crypto'
import paypal from './gateways/paypal'
import stripe from './gateways/stripe'
import accountCredit from './gateways/accountCredit'

export default {
  components: {
    crypto,
    paypal,
    stripe,
    accountCredit
  },
  props: {
    gateway: {
      type: String,
      required: true
    },
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
  methods: {
    paymentComplete () {
      this.$emit('paymentComplete')
    },
    updateUser () {
      this.$emit('updateUser')
    },
    disableGateway (gateway) {
      this.$emit('disableGateway', gateway)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
