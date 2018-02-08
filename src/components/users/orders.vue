<template>
  <div>
    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
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
      actionButtons: [],
      options: {}
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    fetchOrders () {
      paymentAPI.orders({
        success: response => {
          this.tableData = response.data.result
          this.setTable()
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    setTable (headings) {
      this.setColumns()
      this.setActions()

      this.options = {
        skin: '',
        sortable: ['created_at'],
        filterable: ['created_at'],
        customFilters: [],
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
        perPage: 10
      }

      this.setHeadings()
    },
    setActions () {
      this.actionButtons = [
        { key: 'delete', text: 'Delete', icon: 'icon-trash' }
      ]
    },
    setColumns () {
      this.columns = (this.type === 'simple')
        ? ['created_at', 'provider', 'status', 'actions']
        : ['created_at', 'status', 'provider', 'actions']
    },
    setHeadings () {
      this.options.headings = {
        created_at: 'Created at',
        status: 'Status',
        subscription_provider: 'Provider',
        actions: 'Actions'
      }
    }
  }
}
</script>
