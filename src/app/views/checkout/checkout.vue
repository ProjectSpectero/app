<template>
  <div>
    <loading v-if="loading"/>
    <template v-else-if="!error && showCheckout">
      <div
        v-if="invoice && user"
        class="checkout">
        <top title="Checkout">
          <template v-if="!loading">
            <router-link
              v-if="!isCreditInvoice"
              :to="{ name: 'order', params: { id: invoice.order_id } }"
              class="button-info">
              {{ $t('misc.VIEW') }} {{ $t('misc.ORDER') }}
            </router-link>
            <router-link
              :to="{ name: 'invoice', params: { id: invoice.id } }"
              class="button">
              {{ $t('misc.CANCEL') }}
            </router-link>
          </template>
        </top>
        <div
          v-if="!loading"
          class="container centered">
          <div class="col-12">
            <div class="payment-form col-12">
              <template v-if="!billingProfileUpdateRequired">
                <div
                  v-if="paymentSuccess"
                  class="gateway paid">
                  <div class="icon-check-circle mb-3"/>
                  <h3>Payment Complete</h3>
                  <p class="mb-3">Thank you for your payment! We are now processing your order and it should be available shortly.</p>
                  <router-link
                    :to="{ name: 'invoice', params: { id: invoice.id } }"
                    class="button">
                    View Invoice
                  </router-link>
                </div>

                <div v-else>
                  <div class="select-gateway">
                    <article
                      v-for="(method, id) in methods"
                      :key="id"
                      :class="{ 'active': selectedGateway === id, 'disabled': !method.enabled || method.disabled }"
                      @click="selectGateway(id)">
                      <h3 v-html="$t(`payments.METHODS.${method.lang}.TITLE`)"/>
                      <p v-if="!method.enabled">Not Available</p>
                      <p v-else-if="method.gatewayLabel">{{ method.gatewayLabel }}</p>
                    </article>
                  </div>

                  <div class="current-gateway">
                    <div class="gateway">
                      <gateways
                        v-if="methods[selectedGateway].enabled"
                        :gateway="selectedGateway"
                        :invoice="invoice"
                        :due="due"
                        :customer="customer"
                        @paymentComplete="paymentComplete"
                        @updateUser="updateUser"
                        @disableGateway="disableGateway"/>
                      <div
                        v-else
                        class="message message-warning mb-0">
                        This payment option is unavailable for this transaction.
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="section padded">
                  <billing-form
                    :needs-billing-update="true"
                    @billingProfileUpdated="billingProfileUpdated" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import invoiceAPI from '@/app/api/invoice'
import paymentAPI from '@/app/api/payment'
import orderMixin from '@/app/mixins/order'
import alertProcessing from '@/app/components/invoices/alertProcessing'
import alertUnpayable from '@/app/components/invoices/alertUnpayable'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import gateways from '@/app/components/checkout/gateways'
import billing from '@/app/components/users/settings/billing'

export default {
  components: {
    top,
    error,
    alertProcessing,
    alertUnpayable,
    loading,
    gateways,
    billing
  },
  metaInfo: {
    title: 'Checkout'
  },
  mixins: [
    orderMixin
  ],
  data () {
    return {
      paymentSuccess: false,
      selectedGateway: 'crypto',
      allowedGateways: ['accountCredit'], // Credit is always an available gateway,
      customer: {},
      billingProfileUpdateRequired: false,
      methods: {
        'crypto': {
          enabled: true,
          lang: 'CRYPTO'
        },
        'paypal': {
          enabled: true,
          lang: 'PAYPAL'
        },
        'stripe': {
          enabled: true,
          lang: 'STRIPE'
        },
        'accountCredit': {
          enabled: true,
          lang: 'ACCOUNT_CREDIT'
        }
      },
      errorItem: 'invoice',
      errorCode: 404
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  async created () {
    if (this.$route.query.continueCc) {
      this.selectedGateway = 'stripe'
    }

    await this.syncCurrentUser()
    await this.fetchInvoice(async () => {
      this.loading = true

      await this.getBillingProfile()
      await this.fetchGateways()
    })
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser',
      syncUser: 'appAuth/syncCurrentUser'
    }),
    paymentComplete () {
      this.paymentSuccess = true

      // Syncs current user to add reactive Pro state
      this.syncCurrentUser()
    },
    selectGateway (gateway) {
      this.selectedGateway = gateway
    },
    disableGateway (gateway) {
      this.$set(this.methods[gateway], 'disabled', true)
    },
    async updateUser () {
      await this.syncUser()
      this.methods.accountCredit.gatewayLabel = `${this.$filters.currency(this.user.credit)} Available`
    },
    async fetchGateways () {
      this.loading = true

      await invoiceAPI.gateways({
        data: {
          id: this.invoiceId
        },
        success: response => {
          if (response.data.result) {
            this.error = false
            this.loading = false
            this.allowedGateways = this.allowedGateways.concat(response.data.result)

            if (this.user.credit) {
              this.$set(this.methods.accountCredit, 'gatewayLabel', `${this.$filters.currency(this.user.credit)} Available`)
            } else {
              this.$set(this.methods.accountCredit, 'enabled', false)
            }

            // Don't allow account credit invoices to be paid with account credit
            if (this.invoice.type === 'CREDIT') {
              this.$set(this.methods.accountCredit, 'enabled', false)
            }

            for (let key in this.methods) {
              if ((this.allowedGateways.find(u => u === key) || false) === false) {
                this.methods[key].enabled = false
              }
            }
          }
        },
        fail: e => {
          this.error = true
          this.$router.push({ name: 'generic-error' })
        }
      })
    },
    async getBillingProfile () {
      this.loading = true

      await paymentAPI.getBillingProfile({
        data: {},
        success: async response => {
          // this.loading = false
          this.customer = response.data.result

          if (!this.customer.complete && this.order && !this.order.easy_enabled) {
            this.billingProfileUpdateRequired = true
          }
        },
        fail: error => {
          this.loading = false
          this.error = true
          console.error('Unable to get billing profile', error)
        }
      })
    },
    billingProfileUpdated () {
      // This will hide the billing form after successful update
      this.billingProfileUpdateRequired = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container.centered .col-12 {
  max-width: 1200px;
  margin-left: 0;
}
.select-gateway {
  display: flex;
  flex-direction: row;

  article {
    flex-basis: 100px;
    flex-grow: 1;
    margin-right: 8px;
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: $white;
    border-radius: 4px;
    border: 1px solid $color-border;
    cursor: pointer;

    h3 {
      margin-bottom: 0;
    }
    p {
      margin-top: 6px;
      font-size: 90%;
      opacity: 0.6;
    }
    &.active {
      color: $color-success;
      background: lighten($color-success, 50%);
      border-color: lighten($color-success, 20%);
    }
    &.disabled {
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.6;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
