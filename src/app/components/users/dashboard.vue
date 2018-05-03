<template>
  <div>
    <top :title="$i18n.t('misc.DASHBOARD')"></top>
    <div class="orders">
      <h2>{{ $i18n.t('misc.ORDERS') }}</h2>
      <orders-list :pagination="pagination" :tableData="tableData"></orders-list>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order.js'
import top from '@/shared/components/top'
import ordersList from '../orders/miniList'

export default {
  data () {
    return {
      pagination: null,
      tableData: null
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      await orderAPI.myOrders({
        searchId: null,
        page: 1,
        limit: 3,
        keepURL: true,
        success: response => {
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
      })
    }
  },
  components: {
    top,
    ordersList
  },
  metaInfo: {
    title: 'Dashboard'
  }
}
</script>

<style lang="scss" scoped>
.orders {
  width: 50%;
}
</style>
