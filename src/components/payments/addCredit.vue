<template>
  <div class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <h1>{{ $i18n.t('payments.ADD_CREDIT_TITLE') }}</h1>
      <p>{{ $i18n.t('payments.ADD_CREDIT_DESC') }}</p>
      <p class="credit-current">Balance: {{ user.credit | currency }} {{ this.currency }}</p>

      <div class="message" v-html="$i18n.t('payments.ADD_CREDIT_MAX_WARNING', { remaining: this.remaining, max: this.max, currency: this.currency })"></div>
      <br>
      <div class="form-input">
        <div class="label">
          <label for="creditAddAmount">{{ $i18n.t('payments.ADD_CREDIT_FORM_LABEL') }}</label>
        </div>
        <input type="number" id="creditAddAmount" class="input" v-model="amount" :placeholder="$i18n.t('payments.ADD_CREDIT_PLACEHOLDER')" @keyup="watchMaxValue">
      </div>
      <button @click="add(amount)" class="button button-md button-success button-full">
        {{ $i18n.t('misc.PURCHASE') }}
      </button>
    </div>
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
      currency: 'USD'
    }
  },
  metaInfo: {
    title: 'Add Credit'
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

<style lang="scss" scoped>
h1 {
  margin-bottom: 12px;
}
.credit-current {
  margin: 16px 0 18px 0;
  font-size: 16px;
  line-height: 100%;
  font-weight: $font-bold;
}
</style>
