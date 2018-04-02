<template>
  <div v-if="tableData">
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="status" slot-scope="props">
          <div :class="'badge status-' + props.row.status.toLowerCase()">{{ $i18n.t('orders.ORDER_STATUS.' + props.row.status) }}</div>
        </template>
        <template slot="total" slot-scope="props">
          {{ props.row.last_invoice.amount | currency }} {{ props.row.last_invoice.currency }}
        </template>
        <template slot="created_at" slot-scope="props">
          {{ props.row.created_at | moment('MMM D, YYYY') }}
        </template>
        <template slot="due_next" slot-scope="props">
          {{ props.row.due_next | moment('MMM D, YYYY') }}
        </template>
        <template slot="actions" slot-scope="props">
          <router-link class="button" :to="{ name: 'order', params: { id: props.row.id } }">
            View
          </router-link>

          <div class="inline" v-if="props.row.last_invoice && props.row.last_invoice.status === 'UNPAID'">
            <router-link class="button button-success" :to="{ name: 'invoice', params: { id: props.row.last_invoice.id } }">
              Pay Now
            </router-link>
          </div>
        </template>
      </v-client-table>

      <paginator v-if="type !== 'simple'" :pagination="pagination" @changedPage="fetchOrders"></paginator>
    </div>
  </div>
</template>

<script>
import paginator from '@/components/common/paginator'

export default {
  props: {
    searchId: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'simple'
    },
    pagination: Object,
    tableData: Array
  },
  data () {
    return {
      perPage: 10,
      columns: ['created_at'],
      sortableColumns: ['created_at'],
      filterableColumns: null,
      options: {}
    }
  },
  created () {
    this.perPage = (this.type === 'simple') ? 3 : 10
    this.fetchOrders()
  },
  methods: {
    fetchOrders (page) {
      this.$emit('fetchOrders', page)
      this.setTable()
      this.setColumns()
    },
    processTotal (row) {
      return processTotal(row)
    },
    setColumns () {
      this.columns = (this.type === 'simple')
        ? ['id', 'status', 'actions']
        : ['id', 'status', 'created_at', 'due_next', 'total', 'actions']
    },
    setSortableColumns () {
      this.sortableColumns = (this.type === 'simple')
        ? ['id', 'status']
        : ['id', 'created_at', 'due_next', 'status', 'total']
    },
    setHeadings () {
      this.headings = (this.type === 'simple')
        ? {
          id: 'Order ID',
          stauts: 'Status',
          actions: ''
        } : {
          id: 'Order ID',
          created_at: 'Created',
          status: 'Status',
          due_next: 'Next Date Due',
          actions: ''
        }
    },
    setTable () {
      this.setHeadings()
      this.setSortableColumns()

      this.options = {
        skin: '',
        texts: {
          pagination: (this.type === 'simple') ? true : null,
          perPage: this.perPage,
          count: '',
          filter: '',
          filterPlaceholder: 'Search orders',
          limit: 'Records:',
          noResults: 'No matching orders',
          filterBy: 'Filter by {column}',
          loading: 'Loading...',
          defaultOption: 'Select {column}',
          columns: 'Columns'
        },
        headings: this.headings,
        sortable: this.sortableColumns,
        filterable: (this.type !== 'simple'),
        columnsClasses: {
          actions: 'table-actions'
        },
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
  },
  components: {
    paginator
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

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-active {
    @extend .badge-success
  }
  &.status-automated_fraud_check, &.status-manual_fraud_check {
    @extend .badge-warning
  }
}
</style>
