<template>
  <div v-if="!loading">
    <div v-if="valid" class="invoice">

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
          <strong>Spectero, Inc.</strong>
          <div class="invoice-address">
            <div class="address-field">300 Deleware Ave Ste 210-A</div>
            <div class="address-field">Wilmington, DE 19801</div>
            <div class="address-field">United States</div>
            <div class="address-field spaced">customer@spectero.com</div>
          </div>
        </div>
        <div class="invoice-info">
          <table class="invoice-info-table">
            <tr>
              <td><strong>Invoice Number:</strong></td>
              <td>0030</td>
            </tr>
            <tr>
              <td><strong>Invoice Status:</strong></td>
              <td><strong class="invoice-status-unpaid">UNPAID</strong></td>
            </tr>
            <tr>
              <td><strong>Invoice Date:</strong></td>
              <td>February 1, 2018</td>
            </tr>
            <tr>
              <td><strong>Payment Due:</strong></td>
              <td>February 8, 2018</td>
            </tr>
            <tr class="invert">
              <td><strong>Amount Due (USD):</strong></td>
              <td><strong>$134.23</strong></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="invoice-divider"></div>

      <table class="table-styled">
        <thead>
          <tr>
            <th>Item</th>
            <th class="text-center">Quantity</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Example Line Item</td>
            <td class="text-center">2</td>
            <td>$15.00</td>
            <td>$30.00</td>
          </tr>
          <tr>
            <td>Example Line Item</td>
            <td class="text-center">2</td>
            <td>$15.00</td>
            <td>$30.00</td>
          </tr>
          <tr>
            <td>Example Line Item</td>
            <td class="text-center">2</td>
            <td>$15.00</td>
            <td>$30.00</td>
          </tr>
        </tbody>
      </table>

      <div class="invoice-totals">
        <div class="invoice-totals-line">
          <div class="label"><strong>Total:</strong></div>
          <div class="amount"><strong>$340.00</strong></div>
        </div>
        <div class="invoice-totals-line">
          <div class="label">Payment on February 5, 2018 using credit card:</div>
          <div class="amount">$340.00</div>
        </div>
        <div class="invoice-totals-line invoice-total-outstanding">
          <div class="label"><strong>Amount Due (USD):</strong></div>
          <div class="amount"><strong>$0.00</strong></div>
        </div>
      </div>

      <!-- <h1>Invoice #{{ invoice.id }}</h1>
      <ul>
        <li>Amount: {{ invoice.amount }}</li>
        <li>Tax: {{ invoice.tax }}</li>
        <li>Status: {{ invoice.status }}</li>
        <li>Due date: {{ invoice.due_date }}</li>
        <li>Currency: {{ invoice.currency }}</li>
      </ul>

      <router-link :to="{ name: 'order', params: { id: invoice.order_id } }">View order</router-link> -->
    </div>
    <div v-else>
      {{ $i18n.t('errors.UNAUTHORIZED') }}
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
      invoice: null
    }
  },
  created () {
    this.fetchInvoice()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    fetchInvoice () {
      paymentAPI.invoice({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log(response.data.result)
          if (response.data.result && this.user.id === response.data.result.user_id) {
            this.valid = true
            this.loading = false
            this.invoice = response.data.result
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.error = this.$i18n.t(`errors.${keys[0]}`)
          this.loading = false
        }
      })
    }
  }
}
</script>
