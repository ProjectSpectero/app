<template>
  <div v-if="!loading" class="invoice">
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
        <span class="details-title">Bill To</span>

        <strong class="name">
          <div v-if="user.organization">{{ user.organization }}</div>
          <div v-if="user.name">{{ user.name }}</div>
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
            <td><strong>Invoice Number:</strong></td>
            <td>{{ invoice.id }}</td>
          </tr>
          <tr>
            <td><strong>Invoice Status:</strong></td>
            <td><strong :class="statusClass">{{ invoice.status }}</strong></td>
          </tr>
          <tr>
            <td><strong>Invoice Date:</strong></td>
            <td>{{ invoice.updated_at | moment('MMMM D, YYYY') }}</td>
          </tr>
          <tr v-if="canShowDueAmount">
            <td><strong>Payment Due:</strong></td>
            <td>{{ invoice.due_date | moment('MMMM D, YYYY') }}</td>
          </tr>
          <tr v-if="canShowDueAmount" class="invert">
            <td><strong>Amount Due:</strong></td>
            <td><strong>{{ due.amount | currency }} {{ due.currency }}</strong></td>
          </tr>
        </table>
      </div>
    </div>

    <div class="divider"></div>

    <table v-if="order" class="table-styled">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-center">Quantity</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.line_items" :key="item.id">
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
        <div class="label"><strong>Amount Due (USD):</strong></div>
        <div class="amount"><strong>{{ due.amount | currency }} {{ due.currency }}</strong></div>
      </div>
    </div>

    <div v-if="invoice.status === 'UNPAID'">
      <router-link class="button" :to="{ name: 'paypal', params: { invoiceId: invoice.id } }">
        Pay with Paypal
      </router-link>

      <router-link class="button" :to="{ name: 'stripe', params: { invoiceId: invoice.id } }">
        Pay with Credit Card
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      loading: true,
      valid: false,
      invoice: null,
      order: null,
      due: 0,
      transactions: null
    }
  },
  created () {
    this.syncCurrentUser()
    this.fetchInvoice()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    statusClass () {
      if (this.invoice.status === 'PAID') {
        return 'status-paid'
      } else if (this.invoice.status === 'REFUNDED') {
        return 'status-refunded'
      }

      return 'status-unpaid'
    },
    canShowDueAmount () {
      return this.due && this.invoice.status !== 'REFUNDED'
    }
  },
  methods: {
    ...mapActions({
      syncCurrentUser: 'auth/syncCurrentUser'
    }),
    async fetchInvoice () {
      await paymentAPI.invoice({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log('Invoice:', response.data.result)
          if (response.data.result) {
            this.invoice = response.data.result

            // Fetch the order for this invoice
            paymentAPI.order({
              data: {
                id: this.invoice.order_id
              },
              success: response => {
                console.log('Order:', response.data.result)
                if (response.data.result) {
                  this.valid = true
                  this.loading = false
                  this.order = response.data.result

                  // Fetch extra info: total due amount and list of transactions
                  this.fetchDue()
                  this.fetchTransactions()
                }
              },
              fail: error => this.processError(error)
            })
          }
        },
        fail: error => this.processError(error)
      })
    },
    processError (error) {
      this.error = this.errorAPI(error, 'errors')
      this.loading = false
    },
    fetchDue () {
      paymentAPI.due({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.due = response.data.result
          }
        },
        fail: error => this.processError(error)
      })
    },
    fetchTransactions () {
      paymentAPI.transactions({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.transactions = response.data.result
          }
        },
        fail: error => this.processError(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.invoice {
  width: 820px;
  padding: 30px;
  background: $white;
  margin: $pad;

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
</style>
