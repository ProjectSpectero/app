<template>
  <div v-if="!error">
    <div v-if="!loading">
      {{ $i18n.t('payments.PAYMENT_SUCCESS') }}
    </div>
    <div v-else>
      <card class="stripe-card"
        :stripe="stripeKey"
        :options="stripeOptions"
        @change="setProcessedStatus($event.complete)"
      />
      <div class="label label-save-cc">
        <label for="cc-save">
          <input type="checkbox" v-model="saveCard" true-value="1" false-value="0" id="cc-save">
          {{ $i18n.t('payments.CHECK_SAVE_CARD') }}
        </label>
      </div>
      <button @click="pay" :disabled="!processed" class="button button-success button-full button-pay">{{ $i18n.t('payments.BUTTON_PROCESS_PAYMENT') }}</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Card, createToken } from 'vue-stripe-elements-plus'
import paymentAPI from '@/api/payment.js'

export default {
  props: {
    invoiceId: Number
  },
  data () {
    return {
      status: '',
      error: null,
      processed: false,
      loading: true,
      saveCard: false,
      stripeOptions: {
        // https://stripe.com/docs/stripe.js#element-options
      }
    }
  },
  computed: {
    stripeKey () {
      return (process.env.STRIPE_MODE === 'sandbox') ? process.env.STRIPE_SANDBOX_PUBLIC_KEY : process.env.STRIPE_LIVE_PUBLIC_KEY
    }
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'users/setPendingInvoiceStatus'
    }),
    pay () {
      // Stripe token issued
      createToken().then(stripeData => {
        // Process stripe payment on our API
        this.processStripe(this.invoiceId, stripeData)
      })
    },
    processStripe (invoiceId, stripeData) {
      paymentAPI.processStripe({
        data: {
          invoiceId: invoiceId,
          stripeToken: stripeData.token.id,
          save: (this.saveCard === '1') || false
        },
        success: async processResponse => {
          await this.setPendingInvoiceStatus(true)
          this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
          this.$router.push({ name: 'invoice', params: { id: invoiceId } })
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'payments'))
          this.$router.push({ name: 'invoices' })
        }
      })
    },
    setProcessedStatus (status) {
      this.processed = status
    }
  },
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
.label-save-cc {
  border-radius: 4px;
  margin: 16px 0;
}
</style>
