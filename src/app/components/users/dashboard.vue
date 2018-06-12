<template>
  <div v-if="tableData">
    <top :title="$i18n.t('misc.DASHBOARD')"/>
    <div class="dashboard">
      <div class="dashboard-component">
        <h2>{{ $i18n.t('misc.ORDERS') }}</h2>
        <orders-list
          :pagination="pagination"
          :table-data="tableData"/>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order.js'
import top from '@/shared/components/top'
import ordersList from '../orders/miniList'

export default {
  components: {
    top,
    ordersList
  },
  metaInfo: {
    title: 'Dashboard'
  },
  data () {
    return {
      pagination: null,
      tableData: null
    }
  },
  created () {
    this.$router.push({ name: 'nodes' })
    // this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      await orderAPI.myOrders({
        queryParams: {
          searchId: null,
          page: 1,
          perPage: 3
        },
        success: response => {
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
}
.dashboard-component {
  flex-grow: 1;
  flex-basis: 0;
  margin: 10px;

  padding: $pad;
  background: $white;
  border-radius: 4px;
  border: 1px solid $color-border;

  h2 {
    font-size: 20px;
  }
}
</style>
