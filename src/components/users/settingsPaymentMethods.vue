<template>
  <div class="container">
    <h2>Payment methods</h2>

    <div v-if="user.stored_card_identifier" class="form-input">
      <div class="label">{{ $i18n.t('users.CLEAR_CREDIT_CARD', { card: user.stored_card_identifier } )}}</div>
      <button class="button" @click.prevent.stop="clearStripe">Clear credit card</button>
    </div>
    <div v-else>
      {{ $i18n.t('users.NO_CREDIT_CARD')}}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import paymentAPI from '@/api/payment.js'

export default {
  props: {
    user: Object
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'auth/syncCurrentUser'
    }),
    clearPaypal () {
      paymentAPI.clearPaypalData({
        success: response => {
          this.$toasted.show('Paypal data cleared successfully!')
        },
        fail: error => {
          console.log('Unable to clear Paypal data', error)
        }
      })
    },
    clearStripe () {
      paymentAPI.clearStripeData({
        success: response => {
          this.syncCurrentUser()
          this.$toasted.show('Credit card data cleared successfully!')
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'payments'))
      })
    }
  }
}
</script>

<style>

</style>
