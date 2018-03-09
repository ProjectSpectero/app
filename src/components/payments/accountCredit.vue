<template>
  <div class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <div v-if="error">{{ errorAPI(error, 'payments') }}</div>
      <div v-else>
        {{ $i18n.t('payments.PAYMENT_PROCESSING') }}
      </div>
    </div>
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
      if (this.$route.params.invoiceId) {
        paymentAPI.processAccountCredit({
          data: {
            invoiceId: this.$route.params.invoiceId
          },
          success: response => {
            console.log('Success', response)
          },
          fail: error => {
            this.error = error
            // this.error404()
          }
        })
      } else {
        this.error404()
      }
    }
  }
}
</script>
