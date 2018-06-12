<template>
  <div class="promo-codes">
    <h3>Promo code</h3>
    <p class="headline-msg">{{ $i18n.t('payments.PROMO.APPLY_MSG') }}</p>
    <form @submit.prevent.stop="add">
      <input
        v-model="promoCode"
        :placeholder="$i18n.t('payments.PROMO.ENTER_PROMO_CODE_HERE')"
        type="text"
        class="input">
      <button
        :class="{ 'button-success': promoCode !== '', 'button-loading': pending }"
        :disabled="promoCode === '' || pending"
        type="submit"
        class="button-md">
        {{ (pending) ? $i18n.t('misc.PLEASE_WAIT') : $i18n.t('payments.PROMO.APPLY_PROMO_CODE_BUTTON') }}
      </button>
    </form>
    <p
      v-if="result.msg"
      :class="result.status"
      class="promo-status">{{ $i18n.t('payments.PROMO.STATUS.' + result.msg) }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import paymentAPI from '@/app/api/payment.js'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      promoCode: '',
      result: {
        status: null,
        msg: null
      },
      pending: false
    }
  },
  methods: {
    ...mapActions({
      updateUser: 'appAuth/syncCurrentUser'
    }),
    add () {
      this.pending = true

      paymentAPI.applyPromoCode({
        data: {
          code: this.promoCode
        },
        success: response => {
          this.pending = false
          this.result.status = 'success'
          this.result.msg = 'PROMO_APPLIED'
          this.promoCode = ''

          // Sync current user to update credit balance
          this.updateUser()
        },
        fail: error => {
          this.pending = false
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
  }
  .headline-msg {
    margin-bottom: 12px;
  }
  form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    input {
      flex: 1;
    }
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
