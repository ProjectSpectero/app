<template>
  <div class="message message-info outstanding">
    <div>
      <h5>{{ $i18n.t('invoices.BALANCE_DUE') }}</h5>
      <p>
        <span v-html="$i18n.t('invoices.BALANCE_DUE_TEXT', { amount: $filters.currency(due.amount) })"/>

        <span
          v-if="order && order.status === 'ACTIVE'"
          v-html="$i18n.t('invoices.BALANCE_DUE_PAYMENT_POSSIBLE', { dueDate: $filters.moment(order.due_next, 'MMM D, YYYY') })"/>
        <span
          v-else
          v-html="$i18n.t('invoices.BALANCE_DUE_PLEASE_PAY_NOW')"/>
      </p>
      <p class="actions">
        <pay
          :invoice="invoice"
          :due="due"
          classes="button-info"/>
        <router-link
          v-if="showInvoiceLink"
          :to="{ name: 'invoice', params: { id: invoice.id } }"
          class="button">View Invoice</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import pay from './pay'

export default {
  components: {
    pay
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    due: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: false,
      default: () => {}
    },
    showInvoiceLink: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .outstanding {
    display: none !important;
  }
}
</style>
