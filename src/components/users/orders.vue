<template>
  <div>
    <top title="Orders"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link v-for="s in status" :key="s" :to="{ name: 'ordersByStatus', params: { status: s, page: 1 } }" class="filter-link" :class="{ badge: currentStatus === s }">
          <span>{{ $i18n.t('orders.MENU_STATUS.' + s.toUpperCase()) }}</span>
        </router-link>
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
      status: ['all', 'active', 'cancelled'],
      searchId: null,
      pagination: null,
      tableData: null,
      currentStatus: 'all',
      rules: []
    }
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {
      if (this.$route.name === 'orders') {
        this.$router.push({ name: 'ordersByStatus', params: { status: 'all', page: 1 } })
      }
    },
    sortByStatus (status) {
      const lcStatus = status.toLowerCase()

      if (this.status.find(s => s === lcStatus)) {
        this.currentStatus = lcStatus
        this.rules = [{ field: 'status', operator: '=', value: status }]
      }

      console.log('rules', this.rules)

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
          const i = this.rules.indexOf(r)
          this.rules.splice(i, 1)
        }
      })
      this.fetchWithFilters()
    },
    async fetchWithFilters () {
      if (this.rules.length) {
        await orderAPI.search({
          rules: this.rules,
          success: async response => {
            if (response.data.result.searchId) {
              this.searchId = response.data.result.searchId
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
  watch: {
    '$route': {
      handler (n, o) {
        console.log(o, n)
        if (o.params.status !== n.params.status) {
          if (n.params.status !== 'all') {
            this.sortByStatus(n.params.status)
          } else {
            this.fetchOrders()
          }
        }
      },
      deep: true
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
