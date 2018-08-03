<template>
  <div class="boxed boxed-centered">
    <div class="boxed-container boxed-md">
      <template v-if="!loading">
        <h1>{{ $i18n.t('payments.ADD_CREDIT_TITLE') }}</h1>
        <p>{{ $i18n.t('payments.ADD_CREDIT_DESC') }}</p>
        <p class="credit-current">Balance: {{ user.credit | currency }} {{ currency }}</p>

        <template v-if="remaining > 0">
          <div
            class="message"
            v-html="$i18n.t('payments.ADD_CREDIT_MAX_WARNING', { remaining: remaining, max: max, currency: currency })"/>

          <div class="form-input">
            <div class="label">
              <label for="creditAddAmount">{{ $i18n.t('payments.ADD_CREDIT_FORM_LABEL') }}</label>
            </div>
            <vue-numeric
              id="creditAddAmount"
              v-model="amount"
              :min="0"
              :max="max"
              :precision="2"
              :empty-value="0"
              class="input"
              currency="USD $"
              separator=","
              output-type="Number" />
          </div>
          <button
            class="button-md button-success button-full"
            @click="add(amount)">
            {{ $i18n.t('misc.PURCHASE') }}
          </button>
        </template>
        <template v-else>
          <div
            class="message message-error"
            v-html="$i18n.t('payments.CREDIT_LIMIT_EXCEEDED')"/>

          <router-link
            :to="{ name: 'settings', params: { tab: 'payment' } }"
            class="button button-md button-full">
            {{ $i18n.t('misc.RETURN_TO_SETTINGS') }}
          </router-link>
        </template>
      </template>
      <loading v-else/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentAPI from '@/app/api/payment'
import loading from '@/shared/components/loading'

export default {
  components: {
    loading
  },
  metaInfo: {
    title: 'Add Credit'
  },
  data () {
    return {
      loading: true,
      amount: 10,
      max: 0,
      remaining: 0,
      currency: 'USD'
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  async created () {
    await this.fetchMax()
  },
  methods: {
    fetchMax () {
      paymentAPI.getMaxCredit({
        success: response => {
          this.loading = false
          this.remaining = response.data.result.can_add
          this.max = response.data.result.credit_limit
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
          this.$router.push({ name: 'invoice', params: { id: response.data.result.id } })
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'payments'))
          this.amount = 5
        }
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
