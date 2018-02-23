<template>
  <div v-if="!loading">
    <div v-if="success">
      <h2>Payment processed</h2>
      <p>Your payment has been processed successfully. Thank you!</p>
    </div>
    <div v-else>
      <h2>We were unable to process your payment</h2>
      <p>{{ $i18n.t('errors.PAYMENT_INVALID_PARAMETERS') }}</p>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      loading: true,
      success: false
    }
  },
  created () {
    this.finishPayment()
  },
  methods: {
    finishPayment () {
      if (this.$route.query.mode && this.$route.query.token && this.$route.query.PayerID) {
        paymentAPI.paypalCallback({
          data: {
            mode: this.$route.query.mode,
            token: this.$route.query.token,
            PayerID: this.$route.query.PayerID
          },
          success: response => {
            console.log('Success!')
            this.loading = false
            this.success = true
          },
          fail: error => {
            console.log('Error while finishing payment:', error)
            this.loading = false
            this.success = false
          }
        })
      } else {
        console.log('Error while finishing payment:', this.$route.query)
      }
    }
  }
}
</script>
