<template>
  <v-client-table :data="items" :columns="columns" :options="options">
    <template slot="amount" slot-scope="props">
      {{ props.row.amount | currency }}
    </template>

    <template slot="sync_status" slot-scope="props">
      {{ $i18n.t('orders.SYNC_STATUS.' + props.row.sync_status) }}
    </template>

    <template slot="total" slot-scope="props">
      {{ props.row.amount * props.row.quantity | currency }}
    </template>
  </v-client-table>
</template>

<script>
export default {
  props: {
    items: Array
  },
  data () {
    return {
      columns: ['description', 'type', 'resource', 'sync_status', 'quantity', 'amount', 'total'],
      headings: {
        description: 'Item',
        type: 'Type',
        amount: 'Price',
        quantity: 'Quantity',
        resource: 'Resource',
        sync_status: 'Sync Status',
        total: 'Amount'
      },
      options: {}
    }
  },
  created () {
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} items|{count} items|One item',
        filter: '',
        filterPlaceholder: 'Search items',
        limit: 'Items:',
        page: 'Page:',
        noResults: 'No matching items',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      perPage: 50,
      headings: this.headings,
      sortable: this.columns,
      filterable: false
    }
  }
}
</script>
