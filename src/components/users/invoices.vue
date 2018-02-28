<template>
  <div>
    <top title="Invoices"></top>
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="amount" slot-scope="props">
          {{ props.row.amount | currency }} {{ props.row.currency }}
        </template>
        <template slot="tax" slot-scope="props">
          {{ props.row.tax | currency }} {{ props.row.currency }}
        </template>
        <template slot="due_date" slot-scope="props">
          {{ props.row.due_date | moment('MMM D, YYYY') }}
        </template>
        <template slot="updated_at" slot-scope="props">
          {{ props.row.updated_at | moment('MMM D, YYYY HH:mm:ss') }}
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
    </div>
  </div>
</template>

<script>
import top from '../common/top'
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      tableData: [],
      columns: ['id', 'amount', 'tax', 'status', 'due_date', 'updated_at', 'actions'],
      sortableColumns: ['id', 'amount', 'tax', 'status', 'due_date', 'updated_at'],
      filterableColumns: ['id', 'amount', 'tax', 'status', 'due_date', 'updated_at'],
      headings: {
        id: 'ID',
        status: 'Status',
        tax: 'Tax',
        amount: 'Amount',
        due_date: 'Due date',
        updated_at: 'Last update',
        actions: 'Actions'
      },
      options: {}
    }
  },
  created () {
    this.fetchInvoices()
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} invoices|{count} invoices|One invoice',
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
      perPage: 10,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }
  },
  methods: {
    fetchInvoices () {
      paymentAPI.myInvoices({
        success: response => {
          this.tableData = response.data.result
        },
        fail: error => {
          console.log(this.errorAPI(error, 'errors'))
        }
      })
    }
  },
  components: {
    top
  }
}
</script>
