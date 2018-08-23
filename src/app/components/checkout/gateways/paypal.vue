<template>
  <div class="checkout">
    <div
      v-if="formError"
      class="message message-error">{{ formError }}</div>

    <div
      v-if="redirecting"
      class="loading-overlay">
      <h3>{{ $t('misc.PLEASE_WAIT') }}</h3>
      <p>{{ $t(`payments.METHODS.${lang}.REDIRECT_TEXT`) }}</p>
    </div>
    <div>
      <p
        class="description"
        v-html="$t(`payments.METHODS.${lang}.DESCRIPTION`)"/>

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
</template>

<script>
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
      lang: 'PAYPAL',
      loading: false,
      formError: null,
      redirecting: false
    }
  },
  methods: {
    pay () {
      this.loading = true

      paymentAPI.processPaypal({
        data: {
          invoiceId: this.invoice.id
        },
        success: response => {
          this.loading = false

          if (response.data.result.redirectUrl) {
            this.redirecting = true
            window.location.href = response.data.result.redirectUrl
          } else {
            this.formError = this.$t('misc.UNKNOWN_ERROR')
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.loading = false
          this.formError = this.$t(`errors.${keys[0]}`)
        }
      })
    }
  }
}
</script>
