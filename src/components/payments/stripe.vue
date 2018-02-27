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
        <credit-card></credit-card>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    })
  },
  methods: {
    canUseCard (value) {
      const invoiceId = this.$route.params.invoiceId

      this.chosen = true
      this.useCard = value

      // Pay with pre-saved card
      if (value) {
        paymentAPI.processStripe({
          data: {
            invoiceId: invoiceId
          },
          success: processResponse => {
            this.$router.push({ name: 'invoice', params: { id: invoiceId } })
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
