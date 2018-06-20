<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('misc.INVOICES')">
        <help-button obj="invoices.topics"/>
      </top>
      <div v-if="tableData">
        <div class="container">
          <div class="col-12 content-split">
            <div class="split-list">
              <router-link
                v-for="s in status"
                :key="s"
                :to="{ name: 'invoicesByStatus', params: { status: s, page: 1 } }"
                :class="{ active: currentStatus === s }"
                class="filter-link">
                {{ $i18n.t('invoices.MENU_STATUS.' + s.toUpperCase()) }}
              </router-link>
            </div>
            <div class="split-details">
              <template v-if="tableData.length">
                <invoices-list
                  :search-id="searchId"
                  :pagination="pagination"
                  :table-data="tableData"
                  @changedPage="changedPage"
                  @sortByColumn="sortByColumn"/>
              </template>
              <not-found
                v-else
                type="invoices">
                <slot>
                  <p v-html="$i18n.t('invoices.NO_INVOICES_TEXT')"/>
                </slot>
              </not-found>
            </div>
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
import filtersMixin from '@/app/mixins/listFilters'
import invoiceAPI from '@/app/api/invoice'
import invoicesList from './list'
import paginator from '@/shared/components/paginator'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import helpButton from '@/shared/components/docs/button'

export default {
  components: {
    top,
    error,
    paginator,
    invoicesList,
    loading,
    notFound,
    helpButton
  },
  mixins: [
    filtersMixin
  ],
  metaInfo: {
    title: 'Invoices'
  },
  data () {
    return {
      perPage: 10,
      status: ['all', 'paid', 'unpaid'],
      errorItem: 'invoices'
    }
  },
  computed: {
    currentStatus () {
      return this.$route.params.status ? this.$route.params.status.toLowerCase() : 'all'
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
    if (this.$route.name === 'invoices') {
      this.$router.push({ name: 'invoicesByStatus', params: { status: 'all', page: 1 } })
    } else {
      this.sidebarSort('status', this.currentStatus, this.currentPage)
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
        queryParams: {
          searchId: this.searchId,
          page: page || 1,
          perPage: this.perPage || 10
        },
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
  }
}
</script>

<style lang="scss" scoped>

</style>
