<template>
  <div>
    <div v-if="!loading">
      <div v-if="!success">
        <h2>We were unable to process your payment</h2>
        <p>{{ $i18n.t('payments.PAYMENT_INVALID_PARAMETERS') }}</p>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import paymentAPI from '@/app/api/payment.js'
import loading from '@/shared/components/loading'

export default {
  data () {
    return {
      success: false
    }
  },
  created () {
    this.finishPayment()
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'appUsers/setPendingInvoiceStatus'
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
  },
  components: {
    loading
  }
}
</script>
