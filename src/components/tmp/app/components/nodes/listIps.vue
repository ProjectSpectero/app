<template>
  <div>
    <div
      v-if="ips && ips.length"
      class="list section padded">
      <h4>{{ $i18n.t('misc.IP_ADDRESSES') }}</h4>
      <v-client-table
        :data="ips"
        :columns="columns"
        :options="options">
        <template
          v-if="props.row.ip"
          slot="ip"
          slot-scope="props">
          {{ props.row.ip }}
        </template>
        <template
          slot="cc"
          slot-scope="props">
          <template v-if="props.row.cc">
            {{ getCountryById(props.row.cc).name }}
          </template>
        </template>
      </v-client-table>
    </div>
    <not-found
      v-else
      type="IP addresses"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notFound from '@/shared/components/notFound'

export default {
  components: {
    notFound
  },
  props: {
    ips: {
      type: Array,
      required: true
    },
    showAddresses: {
      type: Boolean,
      required: false,
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
        cc: 'Country',
        city: 'City'
      },
      options: {}
    }
  },
  computed: {
    ...mapGetters({
      countries: 'settings/countries'
    })
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
      const columns = this.showAddresses ? ['ip', 'asn', 'cc', 'city'] : ['asn', 'cc', 'city']
      this.columns = columns
      this.sortableColumns = columns
      this.filterableColumns = columns
    }
  }
}
</script>
