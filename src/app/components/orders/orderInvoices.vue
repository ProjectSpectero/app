<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('orders.INVOICES_FOR_ORDER', { id: $route.params.id })">
        <router-link :to="{ name: 'order', params: { id: $route.params.id } }" class="button button-info">
          {{ $i18n.t('orders.BACK_TO_ORDER') }}
        </router-link>
      </top>

      <div v-if="tableData" class="list">
        <template v-if="tableData.length">
          <invoices-list
            :searchId="searchId"
            :pagination="pagination"
            :tableData="tableData"
            @changedPage="changedPage"
            @sortByColumn="sortByColumn">
          </invoices-list>
        </template>
        <not-found v-else type="invoices">
          <slot>
            <p v-html="$i18n.t('invoices.NO_INVOICES_TEXT')"></p>
          </slot>
        </not-found>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
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
  mixins: [filtersMixin],
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
          console.log(e)
          this.errorCode = 400
          this.error = true
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
.list {
  padding: 20px;
}
</style>
