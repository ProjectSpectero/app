<template>
  <div class="promo-codes">
    <h3>Promo code</h3>
    <p class="headline-msg">{{ $i18n.t('payments.PROMO.APPLY_MSG') }}</p>
    <form @submit.prevent.stop="add">
      <input type="text" v-model="promoCode" class="input" :placeholder="$i18n.t('payments.PROMO.ENTER_PROMO_CODE_HERE')">
      <button type="submit" :disabled="promoCode === null || promoCode === ''" class="button button-md button-info">{{ $i18n.t('payments.PROMO.APPLY_PROMO_CODE_BUTTON') }}</button>
    </form>
    <p v-if="result.msg" class="promo-status" :class="result.status">{{ $i18n.t('payments.PROMO.STATUS.' + result.msg) }}</p>
  </div>
</template>

<script>
import paymentAPI from '@/app/api/payment.js'

export default {
  props: {
    user: Object
  },
  data () {
    return {
      promoCode: null,
      result: {
        status: null,
        msg: null
      }
    }
  },
  methods: {
    add () {
      paymentAPI.applyPromoCode({
        data: {
          code: this.promoCode
        },
        success: response => {
          this.result.status = 'success'
          this.result.msg = 'PROMO_APPLIED'
        },
        fail: error => {
          this.result.status = 'error'
          this.result.msg = Object.keys(error.errors)[0]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.promo-codes {
  margin-bottom: $pad;
  padding: 14px;
  border: 1px solid $color-border;
  border-radius: 4px;

  h3 {
    margin-bottom: 12px;
    font-weight: $font-semi;
  }
  .headline-msg {
    margin-bottom: 12px;
  }
  form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      margin-left: 8px;
    }
  }
  .promo-status {
    margin-top: 8px;
    font-weight: $font-bold;

    &.success {
      color: $color-success;
    }
    &.error {
      color: $color-danger;
    }
  }
}
</style>
