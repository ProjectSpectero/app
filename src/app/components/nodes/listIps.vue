<template>
  <div>
      <div v-if="ips && ips.length" class="list pad-margin">
        <v-client-table :data="ips" :columns="columns" :options="options">
          <template v-if="props.row.ip" slot="ip" slot-scope="props">
            {{ props.row.ip }}
          </template>
          <template slot="created_at" slot-scope="props">
            {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="ips"></not-found>
  </div>
</template>

<script>
import notFound from '@/shared/components/notFound'

export default {
  props: {
    ips: Array,
    showAddresses: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      columns: null,
      sortableColumns: null,
      filterableColumns: null,
      headings: {
        ip: 'IP Address',
        asn: 'ASN',
        cc: 'Country Code',
        city: 'City',
        created_at: 'Creation Date'
      },
      options: {}
    }
  },
  created () {
    this.setColumns()
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} IP addresses|{count} IP addresses|One IP address',
        filter: '',
        filterPlaceholder: 'Search IP addresses',
        limit: 'IP addresses:',
        page: 'Page:',
        noresult: 'This node has no IP addresses yet.',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      columnsClasses: {
        actions: 'table-actions'
      },
      perPage: 10,
      pagination: true,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }
  },
  methods: {
    setColumns () {
      const columns = this.showAddresses ? ['ip', 'asn', 'cc', 'city', 'created_at'] : ['asn', 'cc', 'city', 'created_at']
      this.columns = columns
      this.sortableColumns = columns
      this.filterableColumns = columns
    }
  },
  components: {
    notFound
  }
}
</script>
