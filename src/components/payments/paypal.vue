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
      console.log('On processPayment with params', this.$route.params)

      if (this.$route.params.invoiceId) {
        paymentAPI.processPaypal({
          data: {
            invoiceId: this.$route.params.invoiceId
          },
          success: response => {
            console.log('On processPayment with response', response)
            if (response.data.result.redirectUrl) {
              console.log('Redirecting to ... ', response.data.result.redirectUrl)
              this.redirect(response.data.result.redirectUrl)
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
    },
    redirect (redirectUrl) {
      window.location.href = redirectUrl
    }
  }
}
</script>
