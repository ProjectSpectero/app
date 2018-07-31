<template>
  <div>
    <template v-if="!error">
      <div v-if="invoice && user">
        <top title="View Invoice">
          <router-link
            v-if="!isCreditInvoice"
            :to="{ name: 'order', params: { id: invoice.order_id } }"
            class="button-info">
            {{ $i18n.t('misc.VIEW') }} {{ $i18n.t('misc.ORDER') }}
          </router-link>

          <template v-if="!loading">
            <print :button-text="'Print Invoice'"/>

            <pay
              v-if="isUnpaid && isPayable"
              :invoice="invoice"
              :due="due"
              classes="button-success"
              @update="fetchInvoice"/>
          </template>
        </top>
        <div v-if="!loading">
          <div class="container centered">
            <div class="col-12 invoice-col">
              <div
                v-if="'unpayable' in this.$route.query"
                class="message">
                <div>
                  <h5>Checkout unavailable</h5>
                  <p>We're sorry, checkout is currently unavailable for this invoice. Please check for any errors below or contact our support team if this persists.</p>
                </div>
              </div>

              <alert-processing
                v-if="isProcessing"
                :error-bag="verificationErrors"
                :invoice="invoice"
                @update="fetchInvoice"/>

              <alert-outstanding
                v-else-if="isOutstanding && isUnpaid && isPayable"
                :due="due"
                :invoice="invoice"
                :order="order"/>

              <alert-unpayable
                v-else-if="verified && isUnpaid && !isPayable"
                :invoice="invoice"
                :order="order"/>

              <div class="invoice">
                <div
                  v-if="invoice.status === 'PAID'"
                  class="message-paid message message-success">
                  <div>
                    <h5>{{ $i18n.t('invoices.PAID') }}</h5>
                    <p>{{ $i18n.t('invoices.THANKS') }}</p>
                  </div>
                </div>

                <div class="header">
                  <div class="logo-container">
                    <div class="logo logo-dark logo-md"/>
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

                <div class="divider"/>

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
                      <div
                        v-if="user.address_line_2"
                        class="address-field">
                        {{ user.address_line_2 }}
                      </div>
                      <div class="address-field">
                        <span v-if="user.state">{{ user.state }}</span>
                        <span v-if="user.state && user.post_code">,</span>
                        <span v-if="user.post_code">{{ user.post_code }}</span>
                      </div>
                      <div class="address-field">{{ getCountryById(user.country).name }}</div>
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
                        <tr
                          v-if="canShowDueAmount"
                          class="invert">
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

                <div class="divider"/>

                <table
                  v-if="lineItems"
                  class="lineitems table-styled">
                  <thead>
                    <tr>
                      <th class="width-id">Item ID</th>
                      <th class="text-left">Item Details</th>
                      <th class="width-sm text-left">Type</th>
                      <th class="width-sm text-center">Quantity</th>
                      <th class="width-sm">Price</th>
                      <th class="width-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in lineItems"
                      :key="item.id"
                      :class="{ 'line-error': item.error }">
                      <td>{{ item.id }}</td>
                      <td class="text-left">
                        <template v-if="item.isAddCredit">
                          <span>Add account credit</span>
                        </template>
                        <template v-else>
                          <router-link
                            v-if="item.type !== 'ENTERPRISE'"
                            :to="{ name: 'marketView', params: { id: item.resource, type: (item.type === 'NODE_GROUP' || item.type == 'MANAGED') ? 'group' : 'node' } }">
                            Resource {{ item.resource }}
                          </router-link>
                          <span v-else>
                            Resource {{ item.resource }}
                          </span>
                        </template>

                        <span
                          v-if="item.error"
                          class="line-error-msg">
                          {{ $i18n.t(`invoices.RESOURCE_ERROR.${item.error}`) }}
                        </span>
                      </td>
                      <td class="text-left">
                        <span class="badge">
                          <template v-if="item.type === 'ENTERPRISE'">
                            Enterprise
                          </template>
                          <template v-else-if="item.isAddCredit">
                            Credit
                          </template>
                          <template v-else>
                            <template v-if="item.type === 'MANAGED'">Managed </template>
                            Node
                            <template v-if="item.type === 'NODE_GROUP' || item.type === 'MANAGED'"> Group</template>
                          </template>
                        </span>
                      </td>
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
                  <div
                    v-if="transactions && transactions.length > 0"
                    class="totals-line">
                    <div
                      v-for="transaction in transactions"
                      :key="transaction.id">
                      <div class="label">Payment on {{ transaction.updated_at | moment('MMMM D, YYYY') }} ({{ transaction.type }}):</div>
                      <div class="amount">{{ transaction.amount | currency }} {{ transaction.currency }}</div>
                    </div>
                  </div>
                  <div
                    v-if="canShowDueAmount"
                    class="totals-line total-outstanding">
                    <div class="label"><strong>{{ $i18n.t('invoices.AMOUNT_DUE') }}:</strong></div>
                    <div class="amount"><strong>{{ due.amount | currency }} {{ due.currency }}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import orderMixin from '@/app/mixins/order'
import alertProcessing from './alertProcessing'
import alertOutstanding from './alertOutstanding'
import alertUnpayable from './alertUnpayable'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import pay from './pay'
import print from '@/shared/components/print'

export default {
  components: {
    top,
    error,
    alertOutstanding,
    alertProcessing,
    alertUnpayable,
    loading,
    pay,
    print
  },
  metaInfo: {
    title: 'View Invoice'
  },
  mixins: [
    orderMixin
  ],
  data () {
    return {
      errorItem: 'invoice',
      errorCode: 404,
      getTransactions: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      countries: 'settings/countries'
    }),
    status () {
      return this.$i18n.t(`invoices.INVOICE_STATUS.${this.invoice.status}`)
    },
    statusClass () {
      let status = this.status.toLowerCase()

      if (status === 'pending') {
        return 'status-pending'
      } else if (status === 'unpaid') {
        return 'status-unpaid'
      } else if (status === 'paid') {
        return 'status-paid'
      } else if (status === 'refunded') {
        return 'status-refunded'
      } else {
        return 'unknown'
      }
    },
    canShowDueAmount () {
      return this.due && this.invoice.status !== 'REFUNDED'
    },
    isOutstanding () {
      return (this.verified || this.isEnterpriseOrder || this.isCreditInvoice) && this.isUnpaid && this.canShowDueAmount && this.verificationErrors.length === 0
    },
    isProcessing () {
      return (this.verified || this.isEnterpriseOrder) && this.verificationErrors.length > 0 && this.order && this.isFixable
    },
    lineItems () {
      let lineItems = []

      // Line items from order
      if (this.order && this.order.line_items.length > 0) {
        lineItems = lineItems.concat(this.order.line_items)
      }

      // Line items from credit
      if (this.isCreditInvoice) {
        lineItems.push({
          id: 'CREDIT',
          quantity: 1,
          amount: this.invoice.amount,
          isAddCredit: true
        })
      }

      return lineItems
    }
  },
  async created () {
    await this.syncCurrentUser()
    await this.fetchInvoice()
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'appAuth/syncCurrentUser'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/icons';

.invoice-col {
  max-width: 1200px;
  margin-left: 0;
}
.invoice {
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
    margin: 24px 0;
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
  .outstanding, .processing, .message-paid {
    margin-bottom: 20px;
  }
  .line-error {
    color: rgba(0,0,0,0.5);
  }
  .line-error-msg {
    display: block;
    margin-top: 8px;
    color: $color-danger;
    font-weight: $font-bold;

    &:before {
      @extend [class^="icon-"];
      @extend .icon-alert-circle:before;

      position: relative;
      top: 1px;
    }
  }
  .lineitems {
    .width-sm {
      width: 20px;
    }
    .width-id {
      width: 90px;
    }
  }
}
@media print {
  .invoice {
    padding: 0;
    border: none;
  }
  .message-paid, .line-error-msg {
    display: none !important;
  }
  .divider {
    margin: 18px 0 !important;
    background: transparent !important;
  }
  .table-styled {
    border: none;

    td, th {
      padding: 12px 8px;
      border: none;
    }
    th {
      background: none;
      padding-bottom: 14px;
    }
  }
}
</style>
