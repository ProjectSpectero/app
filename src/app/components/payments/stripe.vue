<template>
  <div class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <div class="checkout">
        <div class="header">
          <h1>Checkout</h1>
          <h5 class="order-number">{{ $i18n.t('payments.PAY_HEADER', { invoiceId: invoiceId }) }}</h5>
          <p class="order-description">{{ $i18n.t('payments.PAY_DESCRIPTION') }}</p>
          <p class="order-total">Total: {{ due.amount | currency }} {{ due.currency }}</p>
          <p class="order-secure"><span class="icon-lock"></span> {{ $i18n.t('payments.PAY_SECURE') }}</p>
        </div>
      </div>

      <div v-if="user.stored_card_identifier && !chosen">
        <p><strong>{{ $i18n.t('payments.USE_SAVED_CARD', { card: user.stored_card_identifier }) }}</strong></p><br>
        <button class="button button-success" @click="canUseCard(true)">{{ $i18n.t('payments.BUTTON_USE_SAVED_CARD_YES') }}</button>
        <button class="button" @click="canUseCard(false)">{{ $i18n.t('payments.BUTTON_USE_SAVED_CARD_NO') }}</button>
      </div>

      <template v-if="chosen">
        <template v-if="useCard">
          {{ $i18n.t('payments.PAYMENT_PROCESSING') }}
        </template>
        <template v-else>
          <credit-card :invoiceId="invoiceId"></credit-card>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import invoiceAPI from '@/app/api/invoice.js'
import paymentAPI from '@/app/api/payment.js'
import creditCard from './creditCard'

export default {
  metaInfo: {
    title: 'Checkout'
  },
  data () {
    return {
      chosen: false,
      useCard: false,
      due: 0
    }
  },
  async created () {
    await this.fetchDue()
    this.chosen = !this.user.stored_card_identifier
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    invoiceId () {
      return parseInt(this.$route.params.invoiceId)
    }
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'appUsers/setPendingInvoiceStatus'
    }),
    fetchDue () {
      invoiceAPI.due({
        data: {
          id: this.invoiceId
        },
        success: response => {
          if (response.data.result) {
            this.due = response.data.result
          }
        },
        fail: () => this.error404()
      })
    },
    canUseCard (value) {
      this.chosen = true
      this.useCard = value

      // Pay with pre-saved card
      if (value) {
        paymentAPI.processStripe({
          data: {
            invoiceId: this.invoiceId
          },
          success: async processResponse => {
            await this.setPendingInvoiceStatus(true)
            this.$toasted.success(this.$i18n.t('payments.PAYMENT_ACCEPTED'), { duration: 10000 })
            this.$router.push({ name: 'invoice', params: { id: this.invoiceId } })
          },
          fail: error => {
            this.$toasted.error(this.errorAPI(error, 'payments'))
            this.$router.push({ name: 'invoices' })
          }
        })
      }
    }
  },
  components: {
    creditCard
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: $pad;
}
h1 {
  margin-bottom: 12px;
}
.order-number {
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 100%;
  color: $color-dark;
  font-weight: $font-regular;
}
.order-description {
  font-size: 14px;
  color: $color-dark;
}
.order-secure {
  margin-top: 12px;
  color: $color-success;
  font-size: 15px;
  font-weight: $font-bold;
}
.order-total {
  margin: 16px 0 18px 0;
  font-size: 16px;
  line-height: 100%;
  font-weight: $font-bold;
}
</style>
