<template>
  <div class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <div v-if="error">{{ error }}</div>
      <div v-else>
        <h2>{{ $i18n.t('payments.PAYPAL_CONNECT_HEADER') }}</h2>
        <p>{{ $i18n.t('payments.PAYPAL_CONNECT_DESCRIPTION') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import paymentAPI from '@/app/api/payment'

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
        paymentAPI.processPaypal({
          data: {
            invoiceId: this.$route.params.invoiceId
          },
          success: response => {
            if (response.data.result.redirectUrl) {
              this.redirect(response.data.result.redirectUrl)
            }
          },
          fail: error => {
            const keys = Object.keys(error.errors)
            this.error = this.$i18n.t(`errors.${keys[0]}`)
          }
        })
      } else {
        this.error404 = true
      }
    },
    redirect (redirectUrl) {
      window.location.href = redirectUrl
    }
  }
}
</script>
