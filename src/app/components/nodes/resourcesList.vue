<template>
  <v-client-table :data="items" :columns="columns" :options="options">
  </v-client-table>
</template>

<script>
export default {
  props: {
    type: String,
    items: Array
  },
  data () {
    return {
      resources: null,
      columns: ['accessReference', 'accessConfig', 'accessCredentials'],
      headings: {
        accessReference: 'Access Reference',
        accessCredentials: 'Access Credentials',
        accessConfig: 'Access Config'
      },
      options: {}
    }
  },
  created () {
    console.log(this.items)
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
      perPage: 10,
      headings: this.headings,
      sortable: this.columns,
      filterable: false
    }
  }
}
</script>

<style>

</style>
