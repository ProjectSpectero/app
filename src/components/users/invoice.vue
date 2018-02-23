<template>
  <div v-if="!loading" class="invoice">
    <div class="invoice-header">
      <div class="invoice-logo-container">
        <div class="logo logo-dark logo-md"></div>
      </div>
      <div class="invoice-header-details">
        <h1 class="invoice-title">Invoice</h1>
        <strong class="invoice-company">Spectero, Inc.</strong>
        <div class="invoice-biller invoice-address">
          <div class="address-field">300 Deleware Ave Ste 210-A</div>
          <div class="address-field">Wilmington, DE 19801</div>
          <div class="address-field">United States</div>
        </div>
      </div>
    </div>

    <div class="invoice-divider"></div>

    <div class="invoice-details">
      <div class="invoice-client">
        <span class="invoice-details-title">Bill To</span>

        <strong class="invoice-company">
          <div v-if="user.organization">{{ user.organization }}</div>
          <div v-if="user.name">{{ user.name }}</div>
        </strong>

        <div class="invoice-address">
          <div class="address-field">{{ user.address_line_1 }}</div>
          <div class="address-field">{{ user.address_line_2 }}</div>
          <div class="address-field">{{ user.state }}, {{ user.post_code }}</div>
          <div class="address-field spaced">{{ user.email }}</div>
        </div>
      </div>
      <div class="invoice-info">
        <table class="invoice-info-table">
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
            <td>{{ invoice.due_date | moment('MMMM Do, YYYY') }}</td>
          </tr>
          <tr v-if="canShowDueAmount" class="invert">
            <td><strong>Amount Due:</strong></td>
            <td><strong>{{ due.amount }} {{ due.currency }}</strong></td>
          </tr>
        </table>
      </div>
    </div>

    <div class="invoice-divider"></div>

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
          <td>{{ parseFloat(item.amount).toFixed(2) }}</td>
          <td>{{ parseFloat(item.quantity * item.amount).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-totals">
      <div class="invoice-totals-line">
        <div class="label"><strong>Total:</strong></div>
        <div class="amount"><strong>{{ invoice.amount }} {{ invoice.currency }}</strong></div>
      </div>
      <div v-if="transactions && transactions.length > 0" class="invoice-totals-line">
        <div v-for="transaction in transactions" :key="transaction.id">
          <div class="label">Payment on {{ transaction.updated_at | moment('MMMM D, YYYY') }} ({{ transaction.type }}):</div>
          <div class="amount">{{ transaction.amount }} {{ transaction.currency }}</div>
        </div>
      </div>
      <div v-if="canShowDueAmount" class="invoice-totals-line invoice-total-outstanding">
        <div class="label"><strong>Amount Due (USD):</strong></div>
        <div class="amount"><strong>{{ due.amount }} {{ due.currency }}</strong></div>
      </div>
    </div>

    <div v-if="invoice.status === 'UNPAID'">
      <router-link class="button" :to="{ name: 'paypal', params: { invoiceId: invoice.id } }">
        Pay (Paypal)
      </router-link>

      <router-link class="button" :to="{ name: 'stripe', params: { invoiceId: invoice.id } }">
        Pay (Stripe)
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    this.fetchInvoice()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    statusClass () {
      if (this.invoice.status === 'PAID') {
        return 'invoice-status-paid'
      } else if (this.invoice.status === 'REFUNDED') {
        return 'invoice-status-refunded'
      }

      return 'invoice-status-unpaid'
    },
    canShowDueAmount () {
      return this.due && this.invoice.status !== 'REFUNDED'
    }
  },
  methods: {
    fetchInvoice () {
      paymentAPI.invoice({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log(response.data.result)
          if (response.data.result) {
            this.invoice = response.data.result

            // Fetch the order for this invoice
            paymentAPI.order({
              data: {
                id: this.invoice.order_id
              },
              success: response => {
                console.log(response.data.result)
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
