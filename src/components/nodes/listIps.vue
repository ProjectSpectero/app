<template>
  <div>
      <div v-if="ips && ips.length" class="list pad-margin">
        <v-client-table :data="ips" :columns="columns" :options="options">
          <template slot="created_at" slot-scope="props">
            {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="ips"></not-found>
  </div>
</template>

<script>
import notFound from '@/components/common/notFound'

export default {
  props: {
    ips: Array
  },
  data () {
    return {
      columns: ['ip', 'asn', 'cc', 'city', 'created_at'],
      sortableColumns: ['ip', 'asn', 'cc', 'city', 'created_at'],
      filterableColumns: ['ip', 'asn', 'cc', 'city', 'created_at'],
      headings: {
        ip: 'IP Address',
        asn: 'ASN',
        cc: 'Credit Card',
        city: 'City',
        created_at: 'Creation Date'
      },
      options: {}
    }
  },
  created () {
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
  components: {
    notFound
  }
}
</script>
