<template>
  <div class="outstanding">
    <header>
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
    </header>
    <section class="body">
      <pay
        :invoice="invoice"
        :due="due"
        classes="button-info"/>
      <router-link
        v-if="showInvoiceLink"
        :to="{ name: 'invoice', params: { id: invoice.id } }"
        class="button">View Invoice</router-link>
    </section>
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
@import '~@styles/components/icons';

.outstanding {
  margin-bottom: $pad;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid $color-info;

  header {
    padding: 16px;
    color: $white;
    background: $color-info;

    h5 {
      margin-bottom: 0;

      &:before {
        @extend [class^="icon-"];
        @extend .icon-dollar-sign:before;

        position: relative;
        top: 1px;
        margin-right: 6px;
      }
    }
    p {
      margin-top: 0.7em;
      opacity: 0.8;
    }
  }
  .body {
    padding: 16px;
    background: $white;
  }
}

@media print {
  .outstanding {
    display: none !important;
  }
}
</style>
