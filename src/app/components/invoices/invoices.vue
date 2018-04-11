<template>
  <div v-if="tableData">
    <top title="Invoices"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link v-for="s in status" :key="s" :to="{ name: 'invoicesByStatus', params: { status: s, page: 1 } }" class="filter-link" :class="{ badge: currentStatus === s }">
          <span>{{ $i18n.t('invoices.MENU_STATUS.' + s.toUpperCase()) }}</span>
        </router-link>
      </div>
      <div class="split-item split-details">
        <invoices-list
          :searchId="searchId"
          :pagination="pagination"
          :tableData="tableData"
          @changedPage="changedPage"
          @sortByColumn="sortByColumn">
        </invoices-list>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import paginator from '@/shared/components/paginator'
import invoicesList from './list'
import invoiceAPI from '@/app/api/invoice.js'
import filtersMixin from '@/app/mixins/listFilters'

export default {
  mixins: [filtersMixin],
  data () {
    return {
      status: ['all', 'paid', 'unpaid']
    }
  },
  created () {
    if (this.$route.name === 'invoices') {
      this.$router.push({ name: 'invoicesByStatus', params: { status: 'all', page: 1 } })
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
      this.$router.push({ name: 'invoicesByStatus', params: { page: page, status: this.currentStatus } })
    },
    async fetch (page) {
      if (this.rules.length) {
        await invoiceAPI.search({
          rules: this.rules,
          success: async response => {
            if (response.data.result.searchId) {
              this.searchId = response.data.result.searchId
            }

            console.log('Fetching with searchId', this.searchId)

            this.fetchInvoices(page)
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
        })
      } else {
        this.searchId = null
        console.log('Fetching with searchId', this.searchId)
        this.fetchInvoices(page)
      }
    },
    async fetchInvoices (page) {
      await invoiceAPI.myInvoices({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
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
    paginator,
    invoicesList
  },
  metaInfo: {
    title: 'Invoices'
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-paid {
    @extend .badge-success
  }
  &.status-unpaid {
    @extend .badge-error
  }
}
</style>
