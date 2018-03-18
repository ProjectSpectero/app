<template>
  <div>
    <h1>{{ $i18n.t('payments.ADD_CREDIT_TITLE') }}</h1>
    <h4>{{ $i18n.t('payments.ADD_CREDIT_MAX_WARNING', { remaining: this.remaining, max: this.max, currency: this.currency }) }}</h4>

    <p>{{ $i18n.tc('payments.CURRENT_CREDIT', user.credit, { credit: user.credit, currency: this.currency }) }}</p>

    <input type="number" v-model="amount" :placeholder="$i18n.t('payments.ADD_CREDIT_PLACEHOLDER')" @keyup="watchMaxValue">
    <button @click="add(amount)">
      {{ $i18n.t('misc.PURCHASE') }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      amount: 10,
      max: 0,
      remaining: 0,
      currency: 'EUR'
    }
  },
  async created () {
    await this.fetchMax()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    watchMaxValue () {
      if (this.amount > this.max) {
        this.amount = this.max
      }
    },
    fetchMax () {
      paymentAPI.getMaxCredit({
        success: response => {
          this.remaining = response.data.result.can_add
          this.max = parseInt(response.data.result.credit_limit)
          this.currency = response.data.result.currency
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'payments'))
      })
    },
    add (n) {
      paymentAPI.addCredit({
        data: {
          amount: this.amount
        },
        success: response => {
          this.$toasted.success(this.$i18n.t('payments.CREDIT_INVOICED', { amount: this.amount, currency: this.currency }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'payments'))
      })
    }
  }
}
</script>
