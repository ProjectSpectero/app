<template>
  <div class="checkout">
    <div
      v-if="complete"
      class="gateway paid">
      <div class="icon-check-circle mb-3"/>
      <template v-if="!isPartialCredit">
        <h3>Payment Complete</h3>
        <p class="mb-3">Thank you for your payment! We are now processing your order and it should be available shortly.</p>
        <router-link
          :to="{ name: 'invoice', params: { id: invoice.id } }"
          class="button">
          View Invoice
        </router-link>
      </template>
      <template v-else>
        <h3>Partial Payment Complete</h3>
        <p class="mb-3">Thank you for your partial payment. Please click the button below to pay the remaining <strong>{{ $filters.currency(outstanding) }}</strong> balance on this invoice.</p>
        <button
          class="button-info"
          @click.prevent="$router.go($router.currentRoute)">
          Complete Payment
        </button>
      </template>
    </div>
    <div v-else>
      <div
        v-if="formError"
        class="message message-error">{{ formError }}</div>

      <div>
        <p
          class="description"
          v-html="$t(`payments.METHODS.${lang}.DESCRIPTION`, { balance: $filters.currency(user.credit) })"/>

        <p v-html="$t(`payments.METHODS.${lang}.APPLY_TEXT${(isPartialCredit) ? '_PARTIAL' : ''}`, { due: $filters.currency(due.amount), balance: $filters.currency(user.credit), remaining: $filters.currency(outstanding) })"/>

        <p class="order-total">
          Order Total: <span class="amount">{{ due.amount | currency }} {{ due.currency }}</span>
        </p>

        <div class="mt-3">
          <button
            :disabled="loading"
            :class="{'button-loading': loading}"
            class="button-lg button-success button-pay"
            @click.stop="pay"
            v-html="$t(`payments.METHODS.${lang}.PAY_BUTTON`)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentAPI from '@/app/api/payment'

export default {
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
      lang: 'ACCOUNT_CREDIT',
      loading: false,
      formError: null,
      complete: false,
      outstanding: 0
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    isPartialCredit () {
      return this.due.amount > this.user.credit
    }
  },
  created () {
    if (this.isPartialCredit) {
      // FYI: this isn't a computed property because we want to retain this
      // value after we update this.user.credit post transaction completion
      this.outstanding = this.due.amount - this.user.credit
    }
  },
  methods: {
    pay () {
      this.loading = true

      paymentAPI.processAccountCredit({
        data: {
          invoiceId: this.invoice.id
        },
        success: response => {
          this.complete = true

          // Sync current user to update credit balance
          this.$emit('updateUser')

          if (this.isPartialCredit) {
            this.$emit('disableGateway', 'accountCredit')
          }
        },
        fail: error => {
          this.loading = false
          this.formError = this.$t('payments.ACCOUNT_CREDIT_PAYMENT_FAILED')
          console.error('Error while finishing credit payment payment', error)
        }
      })
    }
  }
}
</script>
