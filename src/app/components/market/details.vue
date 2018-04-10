<template>
  <div class="item">
    <h2>{{ item.friendly_name }}</h2>
    <ul>
      <li v-if="item.asn">ASN: {{ item.asn }}</li>
      <li v-if="item.city">City: {{ item.city }}</li>
      <li v-if="item.cc">Country Code: {{ item.cc }}</li>
      <li>Market model: {{ item.market_model }}</li>
      <li>Status: {{ item.status }}</li>
      <li>Price: {{ item.price }}</li>
      <li v-if="item.plan">{{ item.plan }}</li>
    </ul>

    <template v-if="item.nodes">
      <h4>Nodes</h4>
      <nodes :nodes="item.nodes"></nodes>
    </template>

    <template v-if="item.ip_addresses">
      <h4>IP Addresses</h4>
      <ips :ips="item.ip_addresses" :showAddresses="false"></ips>
    </template>
  </div>
</template>

<script>
import ips from '@/app/components/nodes/listIps'
import nodes from './nodes'
import notFound from '@/app/components/common/notFound'

export default {
  props: {
    item: Object,
    type: String
  },
  data () {
    return {
      columns: ['asn', 'cc', 'city'],
      sortableColumns: ['asn', 'cc', 'city'],
      filterableColumns: ['asn', 'cc', 'city'],
      headings: {
        asn: 'ASN',
        cc: 'Country Code',
        city: 'City'
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
        noresult: 'This item has no IP addresses yet.',
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
    notFound,
    ips,
    nodes
  }
}
</script>

<style lang="scss" scoped>

</style>
