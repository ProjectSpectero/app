<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('misc.ORDERS')">
        <help-button obj="orders.topics"></help-button>
      </top>
      <div v-if="tableData">
        <div class="container content-split">
          <div class="split-item split-list">
            <router-link v-for="s in status" :key="s" :to="{ name: 'ordersByStatus', params: { status: s, page: 1 } }" class="filter-link" :class="{ active: currentStatus === s }">
              {{ $i18n.t('orders.MENU_STATUS.' + s.toUpperCase()) }}
            </router-link>
          </div>
          <div class="split-item split-details">
            <template v-if="tableData.length">
              <orders-list
                :searchId="searchId"
                :pagination="pagination"
                :tableData="tableData"
                @refresh="fetchOrders"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn">
              </orders-list>
            </template>
            <not-found v-else type="orders">
              <slot>
                <p v-html="$i18n.t('orders.NO_ORDERS_TEXT')"></p>
              </slot>
            </not-found>
          </div>
        </div>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import filtersMixin from '@/app/mixins/listFilters'
import orderAPI from '@/app/api/order'
import ordersList from './list'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import helpButton from '@/shared/components/docs/button'

export default {
  mixins: [filtersMixin],
  data () {
    return {
      status: ['all', 'active', 'cancelled'],
      errorItem: 'orders'
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
              this.error = false
              this.searchId = response.data.result.searchId
            }

            this.fetchOrders(page)
          },
          fail: e => {
            console.log(e)
            this.errorCode = 400
            this.error = true
          }
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
          this.error = false
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: e => {
          console.log(e)
          this.errorCode = 400
          this.error = true
        }
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
    error,
    ordersList,
    loading,
    notFound,
    helpButton
  },
  metaInfo: {
    title: 'Orders'
  }
}
</script>
