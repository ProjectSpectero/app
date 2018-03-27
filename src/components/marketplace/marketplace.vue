<template>
  <div>
    <top title="Marketplace"></top>

    <div class="content-split">
      <div class="split-item split-list filters-side">
        <filters @changedFilters="search"></filters>
      </div>
      <div class="split-item split-details">
        <v-client-table :data="results" :columns="columns" :options="options">
          <template slot="market_model" slot-scope="props">
             <div class="badge">
               {{ $i18n.t(`market.MODEL_NODE.${props.row.market_model}`) }}
            </div>
          </template>

          <template slot="ips_count" slot-scope="props">
            <span v-if="props.row.ip_addresses">{{ props.row.ip_addresses.length }}</span>
            <span v-else>
              {{ countIpsInNodeGroup(props.row) }}
            </span>
          </template>

          <template slot="type" slot-scope="props">
            <span v-if="props.row.type === 'NODE_GROUP'">Node Group</span>
            <span v-else>Node</span>
          </template>

          <template slot="price" slot-scope="props">
            {{ props.row.price | currency }} USD
          </template>

          <template slot="actions" slot-scope="props">
            <router-link class="button button-success" :to="{ name: 'marketplaceView', params: { type: parseType(props.row.type), id: props.row.id } }">
              {{ $i18n.t('misc.VIEW') }}
            </router-link>

            <button @click.stop="showModal(props.row)" class="button">{{ $i18n.t('misc.PURCHASE') }}</button>
          </template>
        </v-client-table>

        <paginator :pagination="pagination" @changedPage="search"></paginator>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import paginator from '@/components/common/paginator'
import filters from './filters'
import addToCart from './addToCart'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      perPage: 10,
      columns: ['id', 'friendly_name', 'market_model', 'ips_count', 'type', 'price', 'actions'],
      sortableColumns: ['id', 'friendly_name', 'type'],
      headings: {
        id: 'ID',
        friendly_name: 'Name',
        market_model: 'Market Model',
        ips_count: 'IPs',
        actions: ''
      },
      filters: [],
      options: {},
      grouped: true
    }
  },
  created () {
    this.setup()
    this.search()
  },
  computed: {
    ...mapGetters({
      results: 'marketplace/results',
      pagination: 'marketplace/pagination'
    })
  },
  methods: {
    ...mapActions({
      fetch: 'marketplace/fetch'
    }),
    showModal (item) {
      this.$modal.show(addToCart, {
        item: item
      }, {
        draggable: true
      })
    },
    parseType (type) {
      if (type.toLowerCase() === 'node') {
        return 'node'
      }

      return 'group'
    },
    countIpsInNodeGroup (group) {
      let ips = 0
      let nodes = 0

      group.nodes.forEach(node => {
        nodes++
        ips += node.ip_addresses.length
      })

      return this.$i18n.t('marketplace.NODE_GROUP_IP_COUNT', { nodes: nodes, ips: ips })
    },
    setup () {
      this.options = {
        skin: '',
        texts: {
          count: '',
          filter: '',
          filterPlaceholder: 'Search',
          limit: 'Results:',
          page: 'Page:',
          noResults: 'No matching results',
          filterBy: 'Filter by {column}',
          loading: 'Loading...',
          defaultOption: 'Select {column}',
          columns: 'Columns'
        },
        columnsClasses: {
          actions: 'table-actions'
        },
        perPage: 10,
        pagination: null,
        headings: this.headings,
        sortable: this.sortableColumns,
        filterable: false
      }
    },
    search (page) {
      this.fetch({ page: page || 1, perPage: this.perPage, grouped: this.grouped })
    }
  },
  metaInfo: {
    title: 'Marketplace'
  },
  components: {
    top,
    paginator,
    filters,
    addToCart
  }
}
</script>

<style lang="scss" scoped>

</style>
