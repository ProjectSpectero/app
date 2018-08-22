<template>
  <div
    v-if="user"
    class="cc-details">
    <h3>Credit or debit cards</h3>
    <div
      v-if="user.card.last4 !== null"
      class="cc-inner">
      <div class="cc-card">
        <div
          v-if="user.card"
          class="cc-info col">
          <p><strong>{{ user.card.brand }}</strong> ending in <strong>{{ user.card.last4 }}</strong></p>
          <p class="small">Expires {{ user.card.expires }}</p>
        </div>
        <div class="cc-button col">
          <button
            class="button-danger button-icon"
            @click.prevent.stop="clearStripe"><span class="icon-x"/></button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="cc-info col">
        <p>{{ $i18n.t('payments.NO_CREDIT_CARD') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import paymentAPI from '@/app/api/payment.js'

export default {
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
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

<style lang="scss" scoped>
.cc-details {
  margin-bottom: $pad;
  padding: 14px;
  border: 1px solid $color-border;
  border-radius: 4px;

  h3 {
    margin-bottom: 12px;
  }
  .cc-inner {
    width: 100%;
  }
  .cc-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .button-add-card {
    margin-top: 14px;
  }
}
</style>
