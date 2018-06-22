<template>
  <div
    v-if="!loading"
    class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <div
        v-if="!success"
        class="message message-error mb-0">
        <div>
          <h5>We were unable to process your payment</h5>
          <p>{{ $i18n.t('payments.PAYMENT_INVALID_PARAMETERS') }}</p>
        </div>
      </div>
    </div>
  </div>
  <loading v-else/>
</template>

<script>
import paymentAPI from '@/app/api/payment'
import loading from '@/shared/components/loading'

export default {
  components: {
    loading
  },
  data () {
    return {
      success: false
    }
  },
  created () {
    this.processPayment()
  },
  methods: {
    processPayment () {
      if (this.$route.params.invoiceId) {
        paymentAPI.processAccountCredit({
          data: { invoiceId: this.$route.params.invoiceId },
          success: async processResponse => {
            this.loading = false
            this.error = false
            this.success = true

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
  }
}
</script>
