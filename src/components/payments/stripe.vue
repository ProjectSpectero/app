<template>
  <div>
    <div v-if="user.stored_card_identifier && !chosen">
      <h3>{{ $i18n.t('payments.USE_SAVED_CARD', { card: user.stored_card_identifier }) }}</h3>

      <button class="button" @click="canUseCard(true)">{{ $i18n.t('payments.USE_SAVED_CARD_YES') }}</button>
      <button class="button" @click="canUseCard(false)">{{ $i18n.t('payments.USE_SAVED_CARD_NO') }}</button>
    </div>

    <template v-if="chosen">
      <template v-if="useCard">
        Payment in process, please wait ...
      </template>
      <template v-else>
        <credit-card :invoiceId="invoiceId"></credit-card>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import paymentAPI from '@/api/payment.js'
import creditCard from './creditCard'

export default {
  data () {
    return {
      chosen: false,
      useCard: false
    }
  },
  created () {
    this.chosen = !this.user.stored_card_identifier
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    invoiceId () {
      return this.$route.params.invoiceId
    }
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'users/setPendingInvoiceStatus'
    }),
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
