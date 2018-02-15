<template>
  <div v-if="status === 'error'">
    <h2>We were unable to process your payment</h2>
    {{ errorMessage }}
  </div>
  <div v-else-if="status === 'success'">
    <h2>Payment processed</h2>
    <p>Your payment has been processed successfully. Thank you!</p>
  </div>
  <div v-else>
    <h2>Completing payment ...</h2>
    <p>Please wait while we complete your payment ...</p>
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      status: '',
      errorMessage: null
    }
  },
  created () {
    this.validatePayment()
  },
  methods: {
    validatePayment () {
      const params = this.$route.query
      console.log('On validatePayment with params', params)
      if (params.mode && params.token && params.PayerID) {
        paymentAPI.processPaypal({
          data: params,
          success: response => {
            console.log('On validatePayment with response', response)
            this.status = 'success'
          },
          fail: error => {
            const keys = Object.keys(error.errors)
            this.errorMessage = this.$i18n.t(`errors.${keys[0]}`)
            this.status = 'error'
          }
        })
      } else {
        this.error = this.$i18n.t('errors.PAYMENT_INVALID_PARAMETERS')
      }
    }
  }
}
</script>
