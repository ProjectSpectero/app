<template>
  <div>
    <top title="Orders"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link v-for="s in status" :key="s" :to="{ name: 'ordersByStatus', params: { status: s, page: 1 } }" class="filter-link" :class="{ active: currentStatus === s }">
          <span>{{ $i18n.t('orders.MENU_STATUS.' + s.toUpperCase()) }}</span>
        </router-link>
      </div>
      <div class="split-item split-details">
        <orders-list
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
import orderAPI from '@/app/api/order.js'
import top from '@/shared/components/top'
import ordersList from './list'
import filtersMixin from '@/app/mixins/listFilters'

export default {
  mixins: [filtersMixin],
  data () {
    return {
      status: ['all', 'active', 'cancelled']
    }
  },
  created () {
    if (this.$route.name === 'orders') {
      this.$router.push({ name: 'ordersByStatus', params: { status: 'all', page: 1 } })
    } else {
      this.sidebarSort('status', this.currentStatus, this.currentPage)
    }
  },
  computed: {
    currentStatus () {
      return this.$route.params.status ? this.$route.params.status.toLowerCase() : 'all'
    }
  },
  methods: {
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
        this.sidebarSort('status', this.currentStatus, n.params.page)
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
