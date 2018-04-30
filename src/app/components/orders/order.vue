<template>
  <div v-if="order">
    <top title="Order Details">
      <router-link class="button" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
        {{ $i18n.t('orders.VIEW_INVOICE') }}
      </router-link>

      <div class="inline" v-if="order.last_invoice && order.last_invoice.status === 'UNPAID'">
        <router-link class="button button-success" :to="{ name: 'invoice', params: { id: order.last_invoice.id } }">
          {{ $i18n.t('misc.PAY_NOW') }}
        </router-link>
      </div>
    </top>
    <div v-if="!loading" class="order">
      <div class="container">
        <div class="col-info">
          <div class="info-box">
            <h5>{{ $i18n.t('orders.REFERENCE_NUM') }}</h5>
            <p>{{ order.id }}</p>
          </div>
          <div class="info-box">
            <h5>{{ $i18n.t('misc.STATUS') }}</h5>
            <p>{{ order.status }}</p>
          </div>
          <div class="info-box">
            <h5>{{ $i18n.t('misc.TOTAL') }}</h5>
            <p>{{ order.last_invoice.amount | currency }} {{ order.last_invoice.currency }}</p>
          </div>
          <div class="info-box">
            <h5>{{ $i18n.t('misc.NEXT_DUE_DATE') }}</h5>
            <p>{{ order.due_next | moment('MMM D, YYYY') }}</p>
            <router-link :to="{ name: 'invoice', params: { id: order.last_invoice_id } }">
              {{ $i18n.t('orders.VIEW_LATEST_INVOICE') }}
            </router-link>
          </div>
          <div v-if="order.status === 'ACTIVE'" class="info-box">
            <h5>{{ $i18n.t('misc.RESOURCES') }}</h5>
            <router-link class="button" :to="{ name: 'resources', params: { id: order.id } }">
              {{ $i18n.t('orders.VIEW_ALL_RESOURCES') }}
            </router-link>
          </div>
        </div>
      </div>

      <items :items="order.line_items"></items>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import top from '@/shared/components/top'
import orderAPI from '@/app/api/order'
import items from './items'

export default {
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
      user: 'appAuth/user'
    })
  },
  methods: {
    async fetchOrder () {
      await orderAPI.order({
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
  },
  components: {
    top,
    items
  },
  metaInfo: {
    title: 'Order Details'
  }
}
</script>

<style lang="scss" scoped>

</style>
