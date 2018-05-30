<template>
  <div v-if="!loading">
    <template v-if="!error">
      <div v-if="invoice">
        <top title="View Invoice">
          <router-link :to="{ name: 'invoices' }" class="button">
            {{ $i18n.t('invoices.BACK') }}
          </router-link>

          <template v-if="verified && !verificationErrors && invoice.status === 'UNPAID' && canShowDueAmount">
            <pay :invoice="invoice" :due="due" classes="button button-success" @update="fetchInvoice"></pay>
          </template>
        </top>
        <div class="container">
          <div v-if="invoice.status === 'PAID'" class="message-paid message message-success">
            <h5><span class="icon-check-circle"></span> {{ $i18n.t('invoices.PAID') }}</h5>
            <p>{{ $i18n.t('invoices.THANKS') }}</p>
          </div>

          <template v-if="verified && !verificationErrors && invoice.status === 'UNPAID' && canShowDueAmount">
            <alert-outstanding :due="due" :invoice="invoice"></alert-outstanding>
          </template>
          <template v-else-if="verified && verificationErrors && isFixable(order.status)">
            <alert-processing :errorBag="verificationErrors" :invoice="invoice" @update="fetchInvoice"></alert-processing>
          </template>

          <div class="invoice">
            <div class="header">
              <div class="logo-container">
                <div class="logo logo-dark logo-md"></div>
              </div>
              <div class="header-details">
                <h1 class="title">Invoice</h1>
                <strong class="company">Spectero, Inc.</strong>
                <div class="biller address">
                  <div class="address-field">300 Deleware Ave Ste 210-A</div>
                  <div class="address-field">Wilmington, DE 19801</div>
                  <div class="address-field">United States</div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="details">
              <div class="client">
                <span class="details-title">{{ $i18n.t('invoices.BILL_TO') }}</span>

                <strong class="name">
                  <div v-if="user.organization">{{ user.organization }}</div>
                  <div v-if="user.name">{{ user.name }}</div>
                  <div v-if="user.tax_identification">{{ user.tax_identification }}</div>
                </strong>

                <div class="address">
                  <div class="address-field">{{ user.address_line_1 }}</div>
                  <div class="address-field">{{ user.address_line_2 }}</div>
                  <div class="address-field">{{ user.state }}, {{ user.post_code }}</div>
                  <div class="address-field spaced">{{ user.email }}</div>
                </div>
              </div>
              <div class="info">
                <table class="info-table">
                  <tr>
                    <td><strong>{{ $i18n.t('invoices.NUMBER') }}:</strong></td>
                    <td>{{ invoice.id }}</td>
                  </tr>
                  <tr>
                    <td><strong>{{ $i18n.t('invoices.TYPE') }}:</strong></td>
                    <td>{{ invoice.type }}</td>
                  </tr>
                  <tr>
                    <td><strong>{{ $i18n.t('invoices.STATUS') }}:</strong></td>
                    <td><strong :class="statusClass">{{ status }}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>{{ $i18n.t('invoices.DATE') }}:</strong></td>
                    <td>{{ invoice.updated_at | moment('MMMM D, YYYY') }}</td>
                  </tr>
                  <template v-if="invoice.type === 'STANDARD'">
                    <tr v-if="canShowDueAmount">
                      <td><strong>Payment Due:</strong></td>
                      <td>{{ invoice.due_date | moment('MMMM D, YYYY') }}</td>
                    </tr>
                    <tr v-if="canShowDueAmount" class="invert">
                      <td><strong>Amount Due:</strong></td>
                      <td>
                        <strong v-if="invoice.type === 'STANDARD'">{{ due.amount | currency }} {{ due.currency }}</strong>
                        <strong v-else>{{ invoice.amount | currency }} {{ invoice.currency }}</strong>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td><strong>{{ $i18n.t('invoices.PAYMENT_DUE') }}:</strong></td>
                      <td>{{ invoice.due_date | moment('MMMM D, YYYY') }}</td>
                    </tr>
                    <tr class="invert">
                      <td><strong>{{ $i18n.t('invoices.AMOUNT_DUE') }}:</strong></td>
                      <td>
                        <strong>{{ invoice.amount | currency }} {{ invoice.currency }}</strong>
                      </td>
                    </tr>
                  </template>
                </table>
              </div>
            </div>

            <div class="divider"></div>

            <table v-if="lineItems" class="table-styled">
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="text-center">Quantity</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lineItems" :key="item.id">
                  <td>{{ item.description }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td>{{ item.amount | currency }}</td>
                  <td>{{ item.quantity * item.amount | currency }}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-line">
                <div class="label"><strong>Total:</strong></div>
                <div class="amount"><strong>{{ invoice.amount | currency }} {{ invoice.currency }}</strong></div>
              </div>
              <div v-if="transactions && transactions.length > 0" class="totals-line">
                <div v-for="transaction in transactions" :key="transaction.id">
                  <div class="label">Payment on {{ transaction.updated_at | moment('MMMM D, YYYY') }} ({{ transaction.type }}):</div>
                  <div class="amount">{{ transaction.amount | currency }} {{ transaction.currency }}</div>
                </div>
              </div>
              <div v-if="canShowDueAmount" class="totals-line total-outstanding">
                <div class="label"><strong>{{ $i18n.t('invoices.AMOUNT_DUE') }}:</strong></div>
                <div class="amount"><strong>{{ due.amount | currency }} {{ due.currency }}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import orderAPI from '@/app/api/order'
import invoiceAPI from '@/app/api/invoice'
import alertProcessing from './alertProcessing'
import alertOutstanding from './alertOutstanding'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import pay from './pay'

export default {
  metaInfo: {
    title: 'View Invoice'
  },
  data () {
    return {
      order: null,
      valid: false,
      invoice: null,
      engagement: null,
      due: 0,
      transactions: null,
      verified: false,
      verificationErrors: null,
      errorItem: 'invoice',
      errorCode: 404
    }
  },
  created () {
    this.syncCurrentUser()
    this.fetchInvoice()
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      pendingPayment: 'appUsers/pendingPayment'
    }),
    status () {
      return this.invoice.status
    },
    statusClass () {
      if (this.status === 'PENDING') {
        return 'status-pending'
      } else if (this.status === 'PAID') {
        return 'status-paid'
      } else if (this.status === 'REFUNDED') {
        return 'status-refunded'
      }

      return 'status-unpaid'
    },
    canShowDueAmount () {
      return this.due && this.invoice.status !== 'REFUNDED'
    },
    lineItems () {
      let lineItems = []

      // Line items from order
      if (this.order && this.order.line_items.length > 0) {
        lineItems = lineItems.concat(this.order.line_items)
      }

      // Line items from credit
      if (this.invoice.type === 'CREDIT') {
        lineItems.push({
          id: 0,
          description: 'Add account credit',
          quantity: 1,
          amount: this.invoice.amount
        })
      }

      return lineItems
    }
  },
  methods: {
    ...mapActions({
      setPendingInvoiceStatus: 'appUsers/setPendingInvoiceStatus',
      syncCurrentUser: 'appAuth/syncCurrentUser'
    }),
    async fetchInvoice () {
      await invoiceAPI.invoice({
        data: { id: this.$route.params.id },
        success: response => {
          if (response.data.result) {
            this.error = false
            this.invoice = response.data.result

            // Set a temporary pending status for newly created invoices
            // (we cannot control how long they take to be accepted as of now).
            // Once we have the fake status set, we can disable that setter.
            if (this.pendingPayment) {
              this.$set(this.invoice, 'status', 'PENDING')
              this.setPendingInvoiceStatus(false)
            }

            // Non-standard invoices (MANUAL/CREDIT) don't have orders
            // associated with them. We can only fetch orders for STANDARD invoices
            if (this.invoice.type === 'STANDARD' && this.invoice.order_id) {
              this.fetchOrder()
            } else {
              this.loading = false
            }

            // Fetch extra info: total due amount and list of transactions
            this.fetchDue()
            this.fetchTransactions()
          }
        },
        fail: (e) => {
          console.log(e)
          this.error = true
        }
      })
    },
    async fetchOrder () {
      await orderAPI.order({
        data: { id: this.invoice.order_id },
        success: async response => {
          if (response.data.result) {
            this.valid = true
            this.loading = false
            this.error = false
            this.order = response.data.result

            // Verify validity of this order (no expired / unavailable resources)
            await this.verifyOrder()
          }
        },
        fail: (e) => {
          console.log(e)
          this.error = true
        }
      })
    },
    async fetchDue () {
      await invoiceAPI.due({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.error = false
            this.due = response.data.result
          }
        },
        fail: e => {
          console.log(e)
          this.error = true
        }
      })
    },
    async fetchTransactions () {
      await invoiceAPI.transactions({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.error = false
            this.transactions = response.data.result
          }
        },
        fail: e => {
          console.log(e)
          this.error = true
        }
      })
    },
    isFixable () {
      const options = ['MANUAL_FRAUD_CHECK', 'AUTOMATED_FRAUD_CHECK', 'PENDING']
      const status = this.order.status

      return options.includes(status)
    },
    async verifyOrder () {
      await orderAPI.verify({
        data: { id: this.invoice.order_id },
        success: response => {
          this.verified = true
          this.verificationErrors = null
        },
        fail: error => {
          this.verified = true

          if (typeof error.errors === 'object') {
            this.verificationErrors = error.errors
          } else {
            this.$toasted.error(this.errorAPI(error, 'orders'))
          }
        }
      })
    }
  },
  components: {
    top,
    error,
    alertOutstanding,
    alertProcessing,
    pay
  }
}
</script>

<style lang="scss" scoped>
.invoice {
  max-width: 1000px;
  padding: 24px;
  background: $white;
  border: 1px solid $color-border;

  .header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .logo-container {
    flex-grow: 1;
  }
  .header-details {
    flex-grow: 1;
    text-align: right;

    .title {
      margin-bottom: 16px;
      font-size: 36px;
      line-height: 100%;
      font-weight: $font-semi;
      text-transform: uppercase;
    }
    .company {
      font-weight: $font-bold;
    }
  }
  .address {
    margin-top: 10px;

    .address-field {
      line-height: 20px;

      &.spaced {
        margin-top: 10px;
      }
    }
  }
  .divider {
    width: 100%;
    height: 1px;
    margin: 30px 0;
    display: block;
    background: $color-smoke;
  }
  .details {
    display: flex;

    .client {
      flex-grow: 1;

      .name {
        line-height: 20px;
        font-weight: $font-bold;
      }
    }
    .info {
      width: 320px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;

      tr {
        line-height: 22px;

        td {
          padding: 4px 0;

          &:first-child {
            padding-right: 16px;
            text-align: right;
          }
        }
        &.invert {
          background: $color-darker;
          color: $white;
        }
      }
    }
    .details-title {
      display: block;
      margin-bottom: 14px;
      font-size: 16px;
      font-weight: $font-bold;
      text-transform: uppercase;
    }
  }
  .status-unpaid {
    color: $color-danger;
  }
  .status-paid {
    color: $color-success;
  }
  .totals {
    display: flex;
    margin-top: 30px;
    flex-direction: column;
    text-align: right;

    .totals-line {

      .label, .amount {
        display: inline-block;
      }
      .amount {
        width: 125px;
      }
    }
    .total-outstanding {
      margin-top: 16px;
    }
  }
}
@media print {
  .message-paid {
    display: none !important;
  }
}
</style>
