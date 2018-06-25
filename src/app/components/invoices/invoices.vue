<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('misc.INVOICES')">
        <help-button obj="invoices.topics"/>
        <ul
          slot="tabs"
          class="tabs tabs-linked-list">
          <li
            v-for="s in status"
            :key="s">
            <router-link
              :to="{ name: 'invoicesByStatus', params: { status: s, page: 1 } }"
              :class="{ active: currentStatus === s }"
              @click.native="tabChange">
              {{ $i18n.t('invoices.MENU_STATUS.' + s.toUpperCase()) }}
            </router-link>
          </li>
        </ul>
      </top>
      <div v-if="!loading">
        <div class="container">
          <div class="col-12">
            <template v-if="tableData && tableData.length">
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
      errorItem: 'invoices',
      error: false,
      loading: true
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
      this.loading = true
      this.$router.push({ name: 'invoicesByStatus', params: { page: page, status: this.currentStatus } })
    },
    tabChange () {
      this.loading = true
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
      this.loading = true

      await invoiceAPI.myInvoices({
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

<style lang="scss" scoped>

</style>
