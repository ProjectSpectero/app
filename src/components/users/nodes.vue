<template>
  <div>
    <h1>Node Groups</h1>

    <div v-if="nodes" class="datatable">
      <v-client-table :data="nodes" :columns="columns" :options="options">
        <template slot="price" slot-scope="props">
          {{ parseFloat(props.row.price).toFixed(2) }}
        </template>
        <template slot="nodes" slot-scope="props">
          <ul>
            <li v-for="node in props.row.nodes" :key="node.id">
              {{ node.id }} ({{ node.price }})
            </li>
          </ul>
        </template>
      </v-client-table>
    </div>
  </div>
</template>

<script>
import nodeAPI from '@/api/node.js'

export default {
  data () {
    return {
      nodes: null,
      columns: ['id', 'friendly_name', 'status', 'market_model', 'price', 'created_at', 'nodes'],
      headings: {
        id: 'ID',
        friendly_name: 'Description',
        status: 'Status',
        user_id: 'User id',
        market_model: 'Market model',
        price: 'Price',
        created_at: 'Created at'
      },
      options: {}
    }
  },
  created () {
    this.fetchNodes()
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
  },
  methods: {
    fetchNodes () {
      nodeAPI.nodeGroups({
        success: response => {
          console.log(response.data)
          if (response.data.result) {
            this.nodes = response.data.result
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.error = this.$i18n.t(`errors.${keys[0]}`)
        }
      })
    }
  }
}
</script>

<style>

</style>
