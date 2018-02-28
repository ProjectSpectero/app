<template>
  <div>
    <top title="View Order"></top>
    <div v-if="!loading" class="order">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import top from '@/components/common/top'
import paymentAPI from '@/api/payment.js'
import lineItems from './itemsList'

export default {
  components: {
    top,
    lineItems
  },
  metaInfo: {
    title: 'View Order'
  },
  data () {
    return {
      loading: true,
      error: null,
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
    async fetchOrder () {
      await paymentAPI.order({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          if (response.data.result) {
            this.order = response.data.result
            this.loading = false
          } else {
            this.error404()
          }
        },
        fail: () => this.error404()
      })
    }
  }
}
</script>
