<template>
    <v-client-table :data="nodes" :columns="columns" :options="options">
      <template slot="name" slot-scope="props">
        {{ props.row.friendly_name }}
      </template>

      <template slot="services" slot-scope="props">
        <ul>
          <li v-for="service in props.row.services" :key="service.id">{{ service.type }}</li>
        </ul>
      </template>

      <template slot="ips" slot-scope="props">
        <ul>
          <li v-for="ip in props.row.ip_addresses" :key="ip.asn">
            <span>ASN: {{ ip.asn }}</span>
            <span>City: {{ ip.city }}</span>
            <span>Country Code: {{ ip.cc }}</span>
          </li>
        </ul>
      </template>

      <template slot="status" slot-scope="props">
        <div :class="'badge status-' + props.row.status">{{ $i18n.t(`nodes.STATUS.${props.row.status}`) }}</div>
      </template>
    </v-client-table>
</template>

<script>
export default {
  props: {
    nodes: Array
  },
  data () {
    return {
      columns: ['friendly_name', 'services', 'ips', 'status'],
      sortableColumns: ['friendly_name', 'services', 'ips', 'status'],
      filterableColumns: ['friendly_name', 'services', 'ips', 'status'],
      options: {},
      headings: {
        friendly_name: 'Friendly Name',
        services: 'Services',
        ips: 'IPs',
        status: 'Status'
      }
    }
  },
  created () {
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} nodes|{count} nodes|One node',
        filter: '',
        filterPlaceholder: 'Search nodes',
        limit: 'Nodes:',
        page: 'Page:',
        noresult: 'This item has no nodes yet.',
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
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-CONFIRMED {
    @extend .badge-success;
  }

  &.status-UNCONFIRMED {
    @extend .badge-error;
  }
}
</style>
