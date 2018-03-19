<template>
  <div v-if="tableData">
    <top title="Invoices"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link :to="{ name: 'invoices' }" class="filter-link">
          <span>All invoices</span>
          <div class="count">-</div>
        </router-link>
        <router-link :to="{ name: 'invoices', params: { filter: 'unpaid' } }" class="filter-link">
          <span>Unpaid invoices</span>
          <div class="count count-danger">-</div>
        </router-link>
        <router-link :to="{ name: 'invoices', params: { filter: 'paid' } }" class="filter-link">
          <span>Paid invoices</span>
          <div class="count">-</div>
        </router-link>
      </div>
      <div class="split-item split-details">
        <div class="datatable">
          <v-client-table :data="tableData" :columns="columns" :options="options">
            <template slot="status" slot-scope="props">
              <div :class="'badge status-' + props.row.status.toLowerCase()">{{ $i18n.t('payments.INVOICE_STATUS.' + props.row.status) }}</div>
            </template>
            <template slot="amount" slot-scope="props">
              {{ props.row.amount | currency }} {{ props.row.currency }}
            </template>
            <template slot="due_date" slot-scope="props">
              {{ props.row.due_date | moment('MMM D, YYYY') }}
            </template>
            <template slot="actions" slot-scope="props">
              <router-link class="button" :to="{ name: 'invoice', params: { id: props.row.id } }">
                View
              </router-link>

              <div class="inline" v-if="props.row.status === 'UNPAID'">
                <router-link class="button button-success" :to="{ name: 'invoice', params: { id: props.row.id } }">
                  Pay Now
                </router-link>
              </div>
            </template>
          </v-client-table>

          <paginator :pagination="pagination" @changedPage="fetchInvoices"></paginator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import paginator from '@/components/common/paginator'
import paymentAPI from '@/api/payment.js'

export default {
  metaInfo: {
    title: 'Invoices'
  },
  data () {
    return {
      pagination: null,
      tableData: null,
      columns: ['id', 'status', 'due_date', 'amount', 'actions'],
      sortableColumns: ['id', 'amount', 'status', 'due_date'],
      filterableColumns: ['id', 'amount', 'status', 'due_date'],
      headings: {
        id: 'Invoice ID',
        status: 'Status',
        amount: 'Amount',
        due_date: 'Due Date',
        actions: ''
      },
      options: {}
    }
  },
  async created () {
    await this.fetchInvoices(1)

    this.options = {
      skin: '',
      texts: {
        count: '',
        filter: '',
        filterPlaceholder: 'Search invoices',
        limit: 'Invoices:',
        page: 'Page:',
        noResults: 'No matching invoices',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      pagination: null,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns,
      columnsClasses: {
        actions: 'table-actions'
      }
    }
  },
  methods: {
    fetchInvoices (page) {
      paymentAPI.myInvoices({
        page: page,
        success: response => {
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: error => {
          console.log(this.errorAPI(error, 'errors'))
        }
      })
    }
  },
  components: {
    top,
    paginator
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
