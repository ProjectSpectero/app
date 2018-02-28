<template>
  <div v-if="tableData">
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="total" slot-scope="props">
          {{ props.row.last_invoice.amount | currency }} {{ props.row.last_invoice.currency }}
        </template>
        <template slot="created_at" slot-scope="props">
          {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
        </template>
        <template slot="due_next" slot-scope="props">
          {{ props.row.due_next | moment('MMM D, YYYY') }}
        </template>
        <template slot="actions" slot-scope="props">
          <router-link class="button" :to="{ name: 'order', params: { id: props.row.id } }">
            View Details
          </router-link>

          <div class="inline" v-if="props.row.last_invoice && props.row.last_invoice.status === 'UNPAID'">
            <router-link class="button button-success" :to="{ name: 'invoice', params: { id: props.row.last_invoice.id } }">
              Pay Now
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
  props: {
    type: {
      type: String,
      default: 'simple'
    }
  },
  data () {
    return {
      tableData: [],
      columns: ['created_at'],
      sortableColumns: ['created_at'],
      filterableColumns: null,
      options: {}
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      await paymentAPI.myOrders({
        success: response => {
          this.tableData = response.data.result
          this.setTable()
          this.setColumns()
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
      })
    },
    processTotal (row) {
      return processTotal(row)
    },
    setColumns () {
      this.columns = (this.type === 'simple')
        ? ['id', 'created_at', 'total']
        : ['id', 'created_at', 'due_next', 'status', 'total', 'actions']
    },
    setSortableColumns () {
      this.sortableColumns = (this.type === 'simple')
        ? ['id', 'created_at', 'total']
        : ['id', 'created_at', 'due_next', 'status', 'total']
    },
    setHeadings () {
      this.headings = (this.type === 'simple')
        ? {
          id: 'ID',
          created_at: 'Created',
          total: 'Total'
        } : {
          id: 'ID',
          created_at: 'Created',
          status: 'Status',
          actions: 'Actions',
          due_next: 'Next Date Due'
        }
    },
    setTable () {
      this.setHeadings()
      this.setSortableColumns()

      this.options = {
        skin: '',
        texts: {
          count: 'Showing {from} to {to} of {count} records|{count} records|One record',
          filter: '',
          filterPlaceholder: 'Search orders',
          limit: 'Records:',
          page: 'Page:',
          noResults: 'No matching records',
          filterBy: 'Filter by {column}',
          loading: 'Loading...',
          defaultOption: 'Select {column}',
          columns: 'Columns'
        },
        perPage: 5,
        headings: this.headings,
        sortable: this.sortableColumns,
        filterable: null,
        customSorting: {
          total: ascending => {
            return function (a, b) {
              let totalA = processTotal(a)
              let totalB = processTotal(b)

              if (ascending) {
                return totalA <= totalB ? 1 : -1
              }

              return totalA >= totalB ? 1 : -1
            }
          }
        }
      }
    }
  }
}

// Process the total amount * quantity for a given row (multiple line orders).
// We're recycling this method when custom sorting by total, so we need to have it
// outside of 'this' scope
function processTotal (row) {
  const invoice = row.last_invoice
  return invoice ? parseFloat(invoice.amount).toFixed(2) + ' ' + invoice.currency : '-'
}
</script>
