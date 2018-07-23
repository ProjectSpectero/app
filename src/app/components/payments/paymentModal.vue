<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('invoices.PAY_INVOICE') }}</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <template v-if="!loading">
        <error
          v-if="error"
          :header="$i18n.t('invoices.GATEWAY_LOADING_FAILED_TITLE')"
          :msg="$i18n.t('invoices.GATEWAY_LOADING_FAILED_TEXT')" />
        <template v-else>
          <p
            class="spaced"
            v-html="$i18n.t('invoices.PAY_INVOICE_TEXT', {
              invoiceId: invoice.id,
              due: $filters.currency(due.amount)
          })"/>

          <p v-html="$i18n.t('invoices.PAY_PLEASE_PAY')"/>

          <div class="payment-options">
            <article
              v-for="(method) in paymentMethods"
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
        </template>
      </template>
      <loading v-else/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import invoiceAPI from '@/app/api/invoice'
import loading from '@/shared/components/loading'
import error from '@/shared/components/error'

export default {
  components: {
    loading,
    error
  },
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
  data () {
    return {
      loading: true,
      allowedGateways: ['credit'] // Credit is always an available gateway
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    paymentMethods () {
      let methods = {
        'crypto': {
          enabled: true,
          route: 'crypto',
          lang: 'payments.METHODS.CRYPTO',
          buttonClass: 'button-info'
        },
        'paypal': {
          enabled: true,
          route: 'paypal',
          lang: 'payments.METHODS.PAYPAL',
          buttonClass: 'button-info'
        },
        'stripe': {
          enabled: true,
          route: 'stripe',
          lang: 'payments.METHODS.STRIPE',
          buttonClass: 'button-info'
        },
        'credit': {
          enabled: true,
          route: 'paypalCredit',
          lang: 'payments.METHODS.CREDIT',
          buttonClass: 'button-dark'
        }
      }

      if (this.user.credit) {
        methods.credit.descriptionAttributes = { balance: this.$filters.currency(this.user.credit) }
      } else {
        methods.credit.enabled = false
        methods.credit.description = 'NO_BALANCE'
      }

      // Manually disable crypto payments during implementation (CF-513)
      methods.crypto.enabled = false
      methods.crypto.description = 'NOT_AVAILABLE'

      // Disable any unavailable gateways + display "this gateway is not available" messages
      for (let key in methods) {
        if ((this.allowedGateways.find(u => u === key) || false) === false) {
          methods[key].enabled = false
          methods[key].description = 'NOT_AVAILABLE'
        }
      }

      return methods
    }
  },
  async created () {
    await this.fetchGateways()
  },
  methods: {
    async fetchGateways () {
      await invoiceAPI.gateways({
        data: {
          id: this.invoice.id
        },
        success: response => {
          if (response.data.result) {
            this.error = false
            this.loading = false
            this.allowedGateways = this.allowedGateways.concat(response.data.result)
          }
        },
        fail: e => {
          console.error(e)
          this.error = true
          this.loading = false
        }
      })
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
