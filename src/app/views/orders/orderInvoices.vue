<template>
  <div>
    <template v-if="!error">
      <top :title="$t('orders.INVOICES_FOR_ORDER', { id: $route.params.id })">
        <router-link
          :to="{ name: 'order', params: { id: $route.params.id } }"
          class="button button-info">
          {{ $t('orders.BACK_TO_ORDER') }}
        </router-link>
      </top>

      <div
        v-if="tableData"
        class="list">
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
            <p v-html="$t('invoices.NO_INVOICES_TEXT')"/>
          </slot>
        </not-found>
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
import invoiceAPI from '@/app/api/invoice'
import filtersMixin from '@/app/mixins/listFilters'
import invoicesList from '@/app/components/invoices/list'
import paginator from '@/shared/components/paginator'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'

export default {
  components: {
    top,
    error,
    paginator,
    invoicesList,
    loading,
    notFound
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
      errorItem: 'invoices'
    }
  },
  created () {
    this.fetch(1)
  },
  methods: {
    changedPage (page) {
      this.$router.push({ name: 'orderInvoices', params: { page: page } })
    },
    async fetch (page) {
      await invoiceAPI.search({
        rules: [{
          operator: '=',
          field: 'order_id',
          value: this.$route.params.id
        }],
        success: async response => {
          if (response.data.result.searchId) {
            this.error = false
            this.searchId = response.data.result.searchId
          }

          this.fetchInvoices(page)
        },
        fail: e => {
          this.error = true
          this.$router.push({ name: 'app-error' })
        }
      })
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
.list {
  padding: 20px;
}
</style>
