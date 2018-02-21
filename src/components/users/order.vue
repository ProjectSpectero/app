<template>
  <div v-if="!loading">
    <div v-if="valid" class="order">
      <h1>Order #{{ order.id }}</h1>
      <ul>
        <li>Due next: {{ order.due_next }}</li>
        <li>Status: {{ order.status }}</li>
        <li>Subscription provider: {{ order.subscription_provider }}</li>
        <li>Term: {{ order.term }}</li>
      </ul>

      <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">View invoice</router-link>

      <line-items :items="order.line_items"></line-items>
    </div>
    <div v-else>
      {{ $i18n.t('errors.UNAUTHORIZED') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import paymentAPI from '@/api/payment.js'
import lineItems from './itemsList'

export default {
  data () {
    return {
      loading: true,
      valid: false,
      order: null
    }
  },
  created () {
    this.fetchOrder()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    fetchOrder () {
      paymentAPI.order({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log(response.data.result)
          if (response.data.result) {
            this.valid = true
            this.loading = false
            this.order = response.data.result
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.error = this.$i18n.t(`errors.${keys[0]}`)
          this.loading = false
        }
      })
    }
  },
  components: {
    lineItems
  }
}
</script>

<style>

</style>
