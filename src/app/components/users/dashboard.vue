<template>
  <div>
    <top title="Dashboard"></top>
    <div class="orders">
      <h2>Orders</h2>
      <orders-list :pagination="pagination" :tableData="tableData"></orders-list>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order.js'
import top from '@/app/components/common/top'
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
