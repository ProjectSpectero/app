<template>
  <v-client-table
    :data="nodes"
    :columns="columns"
    :options="options">
    <template
      slot="name"
      slot-scope="props">
      {{ props.row.friendly_name }}
    </template>

    <template
      slot="services"
      slot-scope="props">
      <div class="service-badges">
        <article
          v-tooltip="service"
          v-for="service in props.row.services"
          :key="service"
          :class="`type-${service.toLowerCase()}`"/>
      </div>
    </template>

    <template
      slot="ips"
      slot-scope="props">
      <ul class="ip-list">
        <li
          v-for="ip in props.row.ip_addresses"
          :key="ip.asn">
          <span class="asn">{{ $i18n.t('misc.ASN') }} {{ ip.asn }}</span>
          <span class="location">{{ ip.city }}, {{ getCountryById(ip.cc).name }}</span>
        </li>
      </ul>
    </template>

    <template
      slot="status"
      slot-scope="props">
      <div :class="'badge-' + props.row.status.toLowerCase()">
        {{ $i18n.t(`nodes.STATUS.${props.row.status}`) }}
      </div>
    </template>
  </v-client-table>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    nodes: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columns: ['friendly_name', 'status', 'services', 'ips'],
      sortableColumns: ['friendly_name', 'status', 'services', 'ips'],
      filterableColumns: ['friendly_name', 'status', 'services', 'ips'],
      options: {},
      headings: {
        friendly_name: 'Friendly Name',
        services: 'Services',
        ips: 'IPs',
        status: 'Status'
      }
    }
  },
  computed: {
    ...mapGetters({
      countries: 'settings/countries'
    })
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
.ip-list {
  padding: 0 8px;
  list-style: none;
  font-size: 90%;
  border: 1px dashed $color-border;

  li {
    padding: 8px 0;
    line-height: 120%;
    border-bottom: 1px dashed $color-border;

    .asn {
      width: 80px;
      display: inline-block;
    }
    .location {
      margin-left: 12px;
      opacity: 0.6;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
