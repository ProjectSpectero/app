<template>
  <div class="invoice">
    <h3>Invoice #{{ invoice.id }}</h3>
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  created () {
    this.fetchInvoice()
  },
  methods: {
    fetchInvoice () {
      paymentAPI.invoice({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log(response.data.result)
        },
        fail: error => {
          console.log(error)
        }
      })
    }
  }
}
</script>
