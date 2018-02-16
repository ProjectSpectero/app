<template>
  <div>
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="amount" slot-scope="props">
          {{ parseFloat(props.row.amount).toFixed(2) }} {{ props.row.currency }}
        </template>
        <template slot="tax" slot-scope="props">
          {{ parseFloat(props.row.tax).toFixed(2) }} {{ props.row.currency }}
        </template>

        <template slot="actions" slot-scope="props">
          <router-link class="button" :to="{ name: 'order', params: { id: props.row.order_id } }">
            View order
          </router-link>

          <div v-if="props.row.status === 'UNPAID'">
            <router-link class="button" :to="{ name: 'paypal', params: { invoiceId: props.row.id } }">
              Pay (Paypal)
            </router-link>

            <router-link class="button" :to="{ name: 'stripe', params: { invoiceId: props.row.id } }">
              Pay (Stripe)
            </router-link>
          </div>
        </template>
      </v-client-table>
    </div>
  </div>
</template>

<script>
import paymentAPI from '@/api/payment.js'

export default {
  data () {
    return {
      tableData: [],
      columns: ['id', 'amount', 'tax', 'status', 'transactions', 'due_date', 'updated_at', 'actions'],
      sortableColumns: ['id', 'amount', 'tax', 'status', 'transactions', 'due_date', 'updated_at'],
      filterableColumns: ['id', 'amount', 'tax', 'status', 'transactions', 'due_date', 'updated_at'],
      headings: {
        id: 'ID',
        status: 'Status',
        tax: 'Tax',
        amount: 'Amount',
        transactions: 'Transactions',
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
          console.log(error)
        }
      })
    }
  }
}
</script>
