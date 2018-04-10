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
import loading from '@/app/components/common/loading'

export default {
  data () {
    return {
      loading: true,
      success: false
    }
  },
  created () {
    this.processPayment()
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'users/setPendingInvoiceStatus'
    }),
    processPayment () {
      if (this.$route.params.invoiceId) {
        paymentAPI.processAccountCredit({
          data: {
            invoiceId: this.$route.params.invoiceId
          },
          success: async processResponse => {
            this.loading = false
            this.success = true
            await this.setPendingInvoiceStatus(true)
            this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
            this.$router.push({ name: 'invoice', params: { id: this.$route.params.invoiceId } })
          },
          fail: error => {
            console.log('Error while finishing payment:', error)
            this.loading = false
            this.success = false
          }
        })
      } else {
        this.error404()
      }
    }
  },
  components: {
    loading
  }
}
</script>
