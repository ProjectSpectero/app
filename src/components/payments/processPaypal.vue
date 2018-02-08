<template>
  <div v-if="error">
    <h2>We were unable to process your payment</h2>
    {{ error }}
  </div>
  <div v-else class="payments">
    <h2>Validating payment ...</h2>
    <p>Please wait while we validate your payment ...</p>
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
    this.validatePayment()
  },
  methods: {
    validatePayment () {
      const params = this.$route.query

      if (params.mode && params.token && params.PayerID) {
        paymentAPI.processPaypal({
          data: params,
          success: response => {
            console.log(response)
            this.error = null
          },
          fail: error => {
            console.log(error)
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
