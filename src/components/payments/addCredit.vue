<template>
  <div>
    <h1>Add credit to your account</h1>
    <h4>You can purchase up to {{ max }} credits.</h4>

    <input type="number" v-model="amount" placeholder="Please type the amount of credits you wish to purchase" @keyup="watchMaxValue">
    <button @click="add(amount)">Click to add {{ amount }} credits</button>
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      amount: 10,
      max: 100
    }
  },
  methods: {
    watchMaxValue () {
      if (this.amount > this.max) {
        this.amount = this.max
      }
    },
    add (n) {
      paymentAPI.addCredit({
        data: {
          amount: this.amount
        },
        success: response => {
          this.$toasted.success(this.amount + ' credits invoiced.')
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'payments'))
      })
    }
  }
}
</script>
