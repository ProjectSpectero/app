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
          @sortByColumn="sortByColumn"
          @search="search"
          @reset="reset">
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
      this.fetchWithFilters()
    },
    sortByColumn (data) {
      this.removeFilter('SORT')

      this.rules.push({
        field: data.column,
        operator: 'SORT',
        value: data.direction.toUpperCase()
      })

      this.fetchWithFilters()
    },
    removeFilter (operator) {
      const index = this.rules.findIndex(r => r.operator === operator)

      if (index !== -1) {
        this.rules.splice(index, 1)
      }
    },
    search (value) {
      if (value.length >= 2) {
        this.removeFilter('SORT')
        this.removeFilter('LIKE')

        this.rules.push({
          field: 'due_next',
          operator: 'LIKE',
          value: '%' + value + '%'
        })
      } else if (value.length === 0) {
        this.removeFilter('LIKE')
      }

      this.fetchWithFilters()
    },
    reset () {
      this.rules.forEach(r => {
        if (r.field !== 'status') {
          console.log('removing rule', r)
          const i = this.rules.indexOf(r)
          this.rules.splice(i, 1)
          console.log('rules now', this.rules)
        }
      })

      console.log('rules are now', this.rules)

      this.fetchWithFilters()
    },
    async fetchWithFilters () {
      if (this.rules.length) {
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
      } else {
        this.searchId = null
        this.fetchOrders()
      }
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
