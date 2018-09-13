<template>
  <div
    v-if="!hideGatewayContent"
    class="checkout">
    <div v-if="displaySavedCard">
      <div
        v-if="formError"
        class="message is-danger">
        <div class="message-body">{{ formError }}</div>
      </div>

      <p
        class="description"
        v-html="$t('payments.USE_SAVED_CARD')"/>
      <div class="saved-card">
        <div>
          <p><strong>{{ savedCard.brand }}</strong> ending in {{ savedCard.last4 }}</p>
          <p class="expires">Expires {{ savedCard.expires }}</p>
        </div>
        <div>
          <button
            :disabled="loading"
            class="button"
            @click="toggleSavedCard">{{ $t('payments.BUTTON_USE_SAVED_CARD_NO') }}</button>
          <button
            :disabled="loading"
            :class="{'is-loading': loading}"
            class="button is-info"
            @click.stop="payUsingSavedCard">{{ $t('payments.BUTTON_USE_SAVED_CARD_YES') }}</button>
        </div>
      </div>
    </div>

    <template v-else>
      <p
        class="description"
        v-html="$t(`payments.METHODS.${lang}.DESCRIPTION`)"/>
      <credit-card
        :invoice="invoice"
        :due="due"
        :customer="customer"
        @paymentComplete="paymentComplete"/>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentAPI from '@/app/api/payment'
import creditCard from './components/creditCard'

export default {
  components: {
    creditCard
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    due: {
      type: Object,
      required: true
    },
    customer: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lang: 'STRIPE',
      loading: false,
      formError: null,
      hideGatewayContent: false,
      savedCard: null,
      displaySavedCard: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  created () {
    this.savedCard = Object.assign({}, this.user.card)
    this.displaySavedCard = this.savedCard.last4 !== null
  },
  methods: {
    paymentComplete () {
      this.hideGatewayContent = true
      this.$emit('paymentComplete')
    },
    toggleSavedCard () {
      this.displaySavedCard = !this.displaySavedCard
    },
    payUsingSavedCard () {
      this.loading = true
      this.formError = null

      paymentAPI.processStripe({
        data: {
          invoiceId: this.invoice.id
        },
        success: async processResponse => {
          this.paymentComplete()
        },
        fail: error => {
          this.loading = false
          this.formError = this.errorAPI(error, 'payments')
          console.log('Stripe process error (saved card)', error)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.saved-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid $color-border;

  .expires {
    margin-top: 2px;
    font-size: 13px;
    opacity: 0.5;
  }
}
</style>
