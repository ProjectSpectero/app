<template>
  <div>
    <top title="Order Details">
      <router-link class="button" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
        View Invoice
      </router-link>

      <div class="inline" v-if="order.last_invoice && order.last_invoice.status === 'UNPAID'">
        <router-link class="button button-success" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
          Pay Now
        </router-link>
      </div>
    </top>
    <div v-if="!loading" class="order">
      <div class="container">
        <div class="order-info">
          <div class="info-box">
            <h5>Reference Number</h5>
            <p>{{ order.id }}</p>
          </div>
          <div class="info-box">
            <h5>Status</h5>
            <p>{{ order.status }}</p>
          </div>
          <div class="info-box">
            <h5>Total</h5>
            <p>{{ order.last_invoice.amount | currency }} {{ order.last_invoice.currency }}</p>
          </div>
          <div class="info-box">
            <h5>Next Due Date</h5>
            <p>{{ order.due_next | moment('MMM D, YYYY') }}</p>
            <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">View Latest Invoice</router-link>
          </div>
        </div>
      </div>

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
    title: 'Order Details'
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

<style lang="scss" scoped>
.order-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .info-box {
    flex: 1;
    margin-right: $pad;
    border-right: 1px solid $color-border;

    &:last-child {
      margin-right: 0;
      border-right: none;
    }
  }
  h5 {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
    line-height: 100%;
    font-weight: $font-semi;
    text-transform: uppercase;
    color: $color-light;
  }
  p {
    display: block;
    font-size: 16px;
    line-height: 22px;
    font-weight: $font-semi;
  }
}
</style>
