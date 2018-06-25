<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t(enterprisePage ? 'misc.ENTERPRISE_ORDERS' : 'misc.ORDERS')">
        <help-button obj="orders.topics"/>
        <ul
          slot="tabs"
          class="tabs tabs-linked-list">
          <li
            v-for="s in status"
            :key="s">
            <router-link
              :to="{ name: enterprisePage ? 'enterpriseOrdersByStatus' : 'ordersByStatus', params: { status: s, page: 1 } }"
              :class="{ active: currentStatus === s }"
              @click.native="tabChange">
              {{ $i18n.t('orders.MENU_STATUS.' + s.toUpperCase()) }}
            </router-link>
          </li>
        </ul>
      </top>
      <div v-if="!loading">
        <div class="container">
          <div class="col-12">
            <template v-if="tableData && tableData.length">
              <orders-list
                :search-id="searchId"
                :pagination="pagination"
                :table-data="tableData"
                @refresh="fetchOrders"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn"/>
            </template>
            <not-found
              v-else
              type="orders">
              <slot>
                <p v-html="$i18n.t('orders.NO_ORDERS_TEXT')"/>
              </slot>
            </not-found>
          </div>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filtersMixin from '@/app/mixins/listFilters'
import orderAPI from '@/app/api/order'
import ordersList from './list'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import helpButton from '@/shared/components/docs/button'

export default {
  components: {
    top,
    error,
    ordersList,
    loading,
    notFound,
    helpButton
  },
  mixins: [
    filtersMixin
  ],
  metaInfo: {
    title: 'Orders'
  },
  data () {
    return {
      status: ['all', 'active', 'cancelled'],
      errorItem: 'orders',
      error: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user',
      isEnterprise: 'appAuth/isEnterprise'
    }),
    currentStatus () {
      return this.$route.params.status ? this.$route.params.status.toLowerCase() : 'all'
    },
    enterprisePage () {
      return (this.isEnterprise && (this.$route.name === 'enterpriseOrders' || this.$route.name === 'enterpriseOrdersByStatus'))
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
  created () {
    if (this.$route.name === 'orders') {
      this.$router.push({ name: 'ordersByStatus', params: { status: 'all', page: 1 } })
    } else if (this.$route.name === 'enterpriseOrders') {
      this.$router.push({ name: 'enterpriseOrdersByStatus', params: { status: 'all', page: 1 } })
    } else {
      this.sidebarSort('status', this.currentStatus, this.currentPage)
    }
  },
  methods: {
    changedPage (page) {
      this.loading = true
      this.$router.push({ name: this.$route.name, params: { page: page, status: this.currentStatus } })
    },
    tabChange () {
      this.loading = true
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
      const method = this.enterprisePage ? orderAPI['myEnterpriseOrders'] : orderAPI['myOrders']

      this.loading = true

      await method({
        queryParams: {
          searchId: this.searchId,
          page: page || 1,
          perPage: this.perPage || 10
        },
        success: response => {
          this.error = false
          this.loading = false
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: e => {
          console.log(e)
          this.errorCode = 400
          this.error = true
          this.loading = false
        }
      })
    }
  }
}
</script>
