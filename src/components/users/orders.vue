<template>
  <div>
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="total" slot-scope="props">
          {{ processTotal(props.row) }}
        </template>
        <template slot="provider" slot-scope="props">
          {{ props.row.subscription_provider }}
        </template>
        <template slot="actions" slot-scope="props">
          <span class="item" v-for="(actionButton, index) in actionButtons" :key="index" @click="triggerAction(props.row, actionButton.key)">
            <span :class="['icon', actionButton.icon]"></span> {{ actionButton.text }}
          </span>
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
      filterableColumns: ['created_at'],
      actionButtons: [],
      options: {}
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    fetchOrders () {
      paymentAPI.myOrders({
        success: response => {
          this.tableData = response.data.result
          this.setTable()
          this.setColumns()
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    processTotal (row) {
      return processTotal(row)
    },
    setActionButtons () {
      this.actionButtons = (this.type === 'simple')
        ? []
        : [{ key: 'view', text: 'Details', icon: 'icon-eye' }]
    },
    setColumns () {
      this.columns = (this.type === 'simple')
        ? ['id', 'created_at', 'total']
        : ['id', 'created_at', 'status', 'provider', 'notes', 'actions']
    },
    setSortableColumns () {
      this.sortableColumns = (this.type === 'simple')
        ? ['id', 'created_at', 'total']
        : ['id', 'created_at', 'status', 'provider', 'notes']
    },
    setFilterableColumns () {
      this.filterableColumns = (this.type === 'simple')
        ? ['id', 'created_at']
        : ['id', 'created_at', 'status', 'provider']
    },
    setHeadings () {
      this.headings = (this.type === 'simple')
        ? {
          id: 'ID',
          created_at: 'Date',
          total: 'Total'
        } : {
          id: 'ID',
          created_at: 'Date',
          status: 'Status',
          provider: 'Provider',
          actions: 'Actions'
        }
    },
    setTable () {
      this.setHeadings()
      this.setSortableColumns()
      this.setFilterableColumns()
      this.setActionButtons()

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
        perPage: 10,
        headings: this.headings,
        sortable: this.sortableColumns,
        filterable: this.filterableColumns,
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
  let sum = 0
  const lineItems = row.line_items

  if (lineItems !== undefined) {
    for (let lineItem in lineItems) {
      if (lineItems.hasOwnProperty(lineItem)) {
        const quantity = lineItems[lineItem].quantity || 1
        sum += parseFloat(lineItems[lineItem].amount * quantity)
      }
    }
  }

  return sum
}
</script>
