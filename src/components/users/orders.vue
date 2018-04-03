<template>
  <div>
    <top title="Orders"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <a href="#" @click.prevent.stop="fetchOrders" class="filter-link" :class="{ badge: !currentStatus }">
          <span>All orders</span>
        </a>
        <a href="#" @click.prevent.stop="sortByStatus('ACTIVE')" class="filter-link" :class="{ badge: currentStatus === 'ACTIVE' }">
          <span>Active orders</span>
        </a>
        <a href="#" @click.prevent.stop="sortByStatus('CANCELLED')" class="filter-link" :class="{ badge: currentStatus === 'CANCELLED' }">
          <span>Cancelled orders</span>
        </a>
      </div>
      <div class="split-item split-details">
        <orders-list
          type="expanded"
          :searchId="searchId"
          :pagination="pagination"
          :tableData="tableData"
          @fetchOrders="fetchOrders"
          @sortByColumn="sortByColumn">
        </orders-list>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/api/order.js'
import top from '@/components/common/top'
import ordersList from './ordersList'

export default {
  data () {
    return {
      searchId: null,
      pagination: null,
      tableData: null,
      currentStatus: null,
      rules: []
    }
  },
  methods: {
    sortByStatus (status) {
      this.rules = [{ field: 'status', operator: '=', value: status }]
      this.generateSearchQuery()
    },
    sortByColumn (data) {
      const index = this.rules.findIndex(r => r.operator === 'SORT')

      if (index !== -1) {
        this.rules.splice(index, 1)
      }

      this.rules.push({
        field: data.column,
        operator: 'SORT',
        value: data.direction.toUpperCase()
      })

      this.generateSearchQuery()
    },
    async generateSearchQuery () {
      console.log('generateSearchQuery with rules', this.rules)
      await orderAPI.search({
        rules: this.rules,
        success: async response => {
          if (response.data.result.searchId) {
            this.currentStatus = status
            this.searchId = response.data.result.searchId
          } else {
            this.currentStatus = null
          }

          this.fetchOrders()
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
      })
    },
    async fetchOrders (page) {
      await orderAPI.myOrders({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
        keepURL: (this.type === 'simple'),
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
    title: 'Orders'
  }
}
</script>
