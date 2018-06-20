<template>
  <div class="modal">
    <div class="modal-header">
      <h2>
        {{ $i18n.t('invoices.PAY_INVOICE') }}
        <small v-if="user.credit > 0">{{ $i18n.t('payments.ACCOUNT_CREDIT', { credit: user.credit }) }}</small>
      </h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <p class="spaced">
        Your invoice <strong>{{ invoice.id }}</strong> currently has an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong>.
      </p>
      <p class="spaced">
        {{ $i18n.t('invoices.PAY_TEXT2') }}
      </p>
      <div>
        <button
          v-for="type in buttons"
          v-if="canUse(type)"
          :key="type.route"
          :class="type.class"
          :disabled="!type.enabled"
          class="button"
          @click="pay(type)">
          {{ $i18n.t('payments.' + type.label) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    invoice: {
      type: Object,
      required: true
    },
    due: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    buttons () {
      let btns = [
        { label: 'PAY_WITH_PAYPAL', route: 'paypal', usage: ['STANDARD', 'MANUAL', 'CREDIT'], enabled: true, class: 'button-info' },
        { label: 'PAY_WITH_STRIPE', route: 'stripe', usage: ['STANDARD'], enabled: true, class: 'button-info' },
        { label: 'PAY_WITH_ACCOUNT_CREDIT', route: 'paypalCredit', usage: ['STANDARD'], enabled: true, class: 'button-info' }
      ]

      if (!this.user.credit) {
        btns[2].label = 'NO_CREDIT'
        btns[2].enabled = false
        btns[2].class = ''
      }

      return btns
    }
  },
  methods: {
    canUse (type) {
      const found = type.usage.find(u => u === this.invoice.type)
      return found || false
    },
    pay (method) {
      this.$router.push({
        name: method.route,
        params: {
          invoiceId: this.invoice.id
        }
      })

      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
h2 > small {
  font-size: 14px;
}
</style>
