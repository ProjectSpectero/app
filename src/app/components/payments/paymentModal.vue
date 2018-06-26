<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('invoices.PAY_INVOICE') }}</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <p
        class="spaced"
        v-html="$i18n.t('invoices.PAY_INVOICE_TEXT', {
          invoiceId: invoice.id,
          due: $filters.currency(due.amount)
      })"/>

      <p v-html="$i18n.t('invoices.PAY_PLEASE_PAY')"/>

      <div class="payment-options">
        <article
          v-for="method in paymentMethods"
          v-if="canUse(method)"
          :key="method.route">
          <header>
            <h3 v-html="$i18n.t(method.lang + '.TITLE')"/>
          </header>
          <section class="description">
            <p v-html="$i18n.t(method.lang + '.' + ((method.description) ? method.description : 'DESCRIPTION'), method.descriptionAttributes)"/>
            <button
              v-if="method.enabled"
              :disabled="!method.enabled"
              :class="method.buttonClass"
              class="button"
              @click="pay(method)"
              v-html="$i18n.t(method.lang + '.' + ((method.buttonText) ? method.buttonText : 'BUTTON_TEXT'))"/>
          </section>
        </article>
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

    paymentMethods () {
      let methods = {
        'paypal': {
          enabled: true,
          route: 'paypal',
          usage: ['STANDARD', 'MANUAL', 'CREDIT'],
          lang: 'payments.METHODS.PAYPAL',
          buttonClass: 'button-info'
        },
        'stripe': {
          enabled: true,
          route: 'stripe',
          usage: ['STANDARD'],
          lang: 'payments.METHODS.STRIPE',
          buttonClass: 'button-info'
        },
        'credit': {
          enabled: true,
          route: 'paypalCredit',
          usage: ['STANDARD'],
          lang: 'payments.METHODS.CREDIT',
          buttonClass: 'button-dark'
        }
      }

      if (this.user.credit) {
        methods.credit.descriptionAttributes = { balance: this.$filters.currency(this.user.credit) }
      } else {
        methods.credit.enabled = false
        methods.credit.description = 'DESCRIPTION_NO_BALANCE'
        methods.credit.buttonText = 'BUTTON_TEXT_NO_BALANCE'
        methods.credit.buttonClass = ''
      }

      return methods
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
.payment-options {
  margin-top: $pad;

  > article {
    margin-bottom: 12px;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid $color-border;

    header {
      h3 {
        margin-bottom: 0.7em;
      }
    }
    .description {
      p {
        opacity: 0.5;
      }
      .button, [class^="button-"] {
        margin-top: 12px;
      }
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
