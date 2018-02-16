<template>
  <div>
    <h2>Items</h2>

    <div class="datatable">
      <v-client-table :data="items" :columns="columns" :options="options">
      </v-client-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array
  },
  data () {
    return {
      columns: ['id', 'description', 'type', 'amount', 'quantity', 'resource', 'updated_at'],
      headings: {
        id: 'ID',
        description: 'Description',
        type: 'Type',
        amount: 'Amount',
        quantity: 'Quantity',
        resource: 'Resource',
        updated_at: 'Last update'
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

<style>

</style>
