<template>
  <div v-if="!loading">
    <div v-if="valid" class="invoice">
      <h1>Invoice #{{ invoice.id }}</h1>
      <ul>
        <li>Amount: {{ invoice.amount }}</li>
        <li>Tax: {{ invoice.tax }}</li>
        <li>Status: {{ invoice.status }}</li>
        <li>Due date: {{ invoice.due_date }}</li>
        <li>Currency: {{ invoice.currency }}</li>
      </ul>

      <router-link :to="{ name: 'order', params: { id: invoice.order_id } }">View order</router-link>
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
