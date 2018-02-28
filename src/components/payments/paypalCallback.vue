<template>
  <div v-if="!loading">
    <div v-if="!success">
      <h2>We were unable to process your payment</h2>
      <p>{{ $i18n.t('payments.PAYMENT_INVALID_PARAMETERS') }}</p>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    ...mapActions({
      setPendingInvoiceStatus: 'users/setPendingInvoiceStatus'
    }),
    finishPayment () {
      if (this.$route.query.mode && this.$route.query.token && this.$route.query.PayerID) {
        paymentAPI.paypalCallback({
          data: {
            mode: this.$route.query.mode,
            token: this.$route.query.token,
            PayerID: this.$route.query.PayerID
          },
          success: async processResponse => {
            this.loading = false
            this.success = true
            await this.setPendingInvoiceStatus(true)
            this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
            this.$router.push({ name: 'invoice', params: { id: processResponse.data.result.invoice_id } })
          },
          fail: error => {
            console.log('Error while finishing payment:', error)
            this.loading = false
            this.success = false
          }
        })
      }
    }
  }
}
</script>
