<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Pay Invoice</h2>
      <button @click="$emit('close')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <p class="spaced">Your invoice <strong>{{ invoice.id }}</strong> currently has an outstanding balance of <strong>{{ due.amount | currency }} {{ due.currency }}</strong>.</p>
      <p class="spaced">Please pay the amount due using the options available below.</p>
      <div>
        <button @click="payClick(type); $emit('close')" v-if="canUse(type)" v-for="type in buttons" :key="type.route" class="button button-info">
          {{ $i18n.t('payments.' + type.label) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invoice: Object,
    due: Object
  },
  data () {
    return {
      buttons: [
        { label: 'PAY_WITH_PAYPAL', route: 'paypal', usage: ['STANDARD', 'MANUAL', 'CREDIT'] },
        { label: 'PAY_WITH_STRIPE', route: 'stripe', usage: ['STANDARD'] },
        { label: 'PAY_WITH_ACCOUNT_CREDIT', route: 'paypalCredit', usage: ['STANDARD'] }
      ]
    }
  },
  methods: {
    canUse (type) {
      const found = type.usage.find(u => u === this.invoice.type)
      return found || false
    },
    payClick (method) {
      this.$router.push({
        name: method.route,
        params: {
          invoiceId: this.invoice.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
