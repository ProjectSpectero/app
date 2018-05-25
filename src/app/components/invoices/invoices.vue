<template>
  <div>
    <template v-if="!error">
      <top title="Invoices"></top>
      <div v-if="tableData">
        <div class="container content-split">
          <div class="split-item split-list">
            <router-link v-for="s in status" :key="s" :to="{ name: 'invoicesByStatus', params: { status: s, page: 1 } }" class="filter-link" :class="{ active: currentStatus === s }">
              {{ $i18n.t('invoices.MENU_STATUS.' + s.toUpperCase()) }}
            </router-link>
          </div>
          <div class="split-item split-details">
            <template v-if="tableData.length">
              <invoices-list
                :searchId="searchId"
                :pagination="pagination"
                :tableData="tableData"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn">
              </invoices-list>
            </template>
            <not-found v-else :msg="$i18n.t('misc.NOT_FOUND', { type: 'invoices' })"></not-found>
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
import invoiceAPI from '@/app/api/invoice'
import invoicesList from './list'
import paginator from '@/shared/components/paginator'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'

export default {
  mixins: [filtersMixin],
  data () {
    return {
      perPage: 10,
      status: ['all', 'paid', 'unpaid'],
      errorItem: 'invoices'
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
              this.error = false
              this.searchId = response.data.result.searchId
            }

            this.fetchInvoices(page)
          },
          fail: e => {
            console.log(e)
            this.errorCode = 400
            this.error = true
          }
        })
      } else {
        this.searchId = null
        this.fetchInvoices(page)
      }
    },
    async fetchInvoices (page) {
      await invoiceAPI.myInvoices({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
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
    paginator,
    invoicesList,
    loading,
    notFound
  },
  metaInfo: {
    title: 'Invoices'
  }
}
</script>

<style lang="scss" scoped>

</style>
