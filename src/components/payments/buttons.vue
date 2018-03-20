<template>
  <div v-if="invoice.status === 'UNPAID'">
    <router-link v-if="canUse(type)" v-for="type in types" :key="type.route" class="button button-success mr-1" :to="{ name: type.route, params: { invoiceId: invoice.id } }">
      {{ $i18n.t('payments.' + type.label) }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    invoice: Object
  },
  data () {
    return {
      types: [
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
    }
  }
}
</script>
