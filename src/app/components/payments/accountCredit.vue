<template>
  <div>
    <div v-if="!loading" class="boxed boxed-centered">
      <div v-if="!success" class="boxed-container boxed-md">
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
    this.processPayment()
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'appUsers/setPendingInvoiceStatus'
    }),
    processPayment () {
      if (this.$route.params.invoiceId) {
        paymentAPI.processAccountCredit({
          data: { invoiceId: this.$route.params.invoiceId },
          success: async processResponse => {
            this.loading = false
            this.error = false
            this.success = true
            await this.setPendingInvoiceStatus(true)
            this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
            this.$router.push({ name: 'invoice', params: { id: this.$route.params.invoiceId } })
          },
          fail: error => {
            console.log('Error while finishing payment:', error)
            this.loading = false
            this.success = false
            this.error = true
          }
        })
      } else {
        this.error = true
        this.loading = false
      }
    }
  },
  components: {
    loading
  }
}
</script>
