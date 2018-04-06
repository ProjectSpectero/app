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
          @changedPage="changedPage"
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
      rules: []
    }
  },
  created () {
    if (this.$route.name === 'orders') {
      this.$router.push({ name: 'ordersByStatus', params: { status: 'all', page: 1 } })
    } else {
      this.sortByStatus(this.currentPage)
    }
  },
  computed: {
    currentStatus () {
      return this.$route.params.status ? this.$route.params.status.toLowerCase() : 'all'
    },
    currentPage () {
      return (this.$route.params.page !== undefined) ? this.$route.params.page : 1
    }
  },
  methods: {
    sortByStatus (page) {
      if (this.status.find(s => s === this.currentStatus)) {
        if (this.currentStatus !== 'all') {
          this.rules = [{ field: 'status', operator: '=', value: this.currentStatus.toUpperCase() }]
        } else {
          this.removeFilter('=')
        }
      }

      console.log('sortByStatus CurrentPage', page)
      this.fetch(page)
    },
    sortByColumn (data) {
      this.removeFilter('SORT')

      this.rules.push({
        field: data.column,
        operator: 'SORT',
        value: data.direction.toUpperCase()
      })

      this.fetch(1)
    },
    removeFilter (operator) {
      const index = this.rules.findIndex(r => r.operator === operator)

      if (index !== -1) {
        this.rules.splice(index, 1)
      }
    },
    changedPage (page) {
      this.$router.push({ name: 'ordersByStatus', params: { page: page, status: this.currentStatus } })
    },
    async fetch (page) {
      if (this.rules.length) {
        await orderAPI.search({
          rules: this.rules,
          success: async response => {
            if (response.data.result.searchId) {
              this.searchId = response.data.result.searchId
            }

            this.fetchOrders(page)
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
        })
      } else {
        this.searchId = null
        this.fetchOrders(page)
      }
    },
    async fetchOrders (page) {
      console.warn('fetchOrders called with status ', this.currentStatus, ' and this.searchId', this.searchId, 'and page', page)
      await orderAPI.myOrders({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
        keepURL: (this.type === 'simple'),
        success: response => {
          this.pagination = response.data.pagination
          this.tableData = response.data.result

          console.log(this.pagination)
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
      })
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

      this.fetch()
    },
    reset () {
      this.rules.forEach(r => {
        if (r.field !== 'status') {
          const i = this.rules.indexOf(r)
          this.rules.splice(i, 1)
        }
      })
      this.fetch()
    }
  },
  watch: {
    '$route': {
      handler (n, o) {
        console.warn('WATCHER KICKED IN')
        console.log('page n, o', n.params.page, o.params.page)
        console.log('status n, o', n.params.status, o.params.status)

        this.sortByStatus(n.params.page)
      },
      deep: true,
      immediate: false
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
