<template>
  <div v-if="success">
    <h2>Payment processed</h2>
    <p>Your payment has been processed successfully. Thank you!</p>
  </div>
  <div v-else>
    <h2>We were unable to process your payment</h2>
    <p>{{ $i18n.t('errors.PAYMENT_INVALID_PARAMETERS') }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    success () {
      return (this.$route.query.mode && this.$route.query.token && this.$route.query.PayerID)
    }
  }
}
</script>
