<template>
  <div v-if="error">{{ error }}</div>
  <div v-else>
    <h2>Connecting to Paypal</h2>
    <p>Please wait while we redirect you to Paypal One Touch™...</p>
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      error: null
    }
  },
  created () {
    this.processPayment()
  },
  methods: {
    processPayment () {
      const invoiceId = this.$route.params.invoiceId

      if (invoiceId) {
        paymentAPI.processPaypal({
          data: {
            invoiceId: invoiceId
          },
          success: response => {
            console.log(response)
            if (response.data.result.redirectUrl) {
              console.log('Redirecting to ... ', response.data.result.redirectUrl)
              window.location = response.data.result.redirectUrl
            } else {
              console.log('Unable to redirect')
            }
          },
          fail: error => {
            const keys = Object.keys(error.errors)
            this.error = this.$i18n.t(`errors.${keys[0]}`)
          }
        })
      } else {
        this.error = this.$i18n.t('errors.PAYMENT_INVALID_PARAMETERS')
      }
    }
  }
}
</script>
