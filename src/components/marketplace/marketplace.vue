<template>
  <div>
    <top title="Marketplace"></top>

    <div class="engine">
      <filters @changedRules="changedRules"></filters>

      <div class="datatable">
        <v-client-table :data="results" :columns="columns" :options="options">
          <template slot="price" slot-scope="props">
            {{ props.row.price | currency }} USD
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
import marketplaceAPI from '@/api/marketplace.js'

export default {
  data () {
    return {
      pagination: null,
      results: [],
      columns: ['id', 'friendly_name', 'market_model', 'ips_count', 'type', 'price'],
      sortableColumns: ['id', 'friendly_name', 'type'],
      headings: {
        id: 'ID',
        ips_count: 'IPs',
        friendly_name: 'Name'
      },
      rules: [],
      options: {}
    }
  },
  created () {
    this.setup()
    this.search()
  },
  methods: {
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
        perPage: 25,
        pagination: null,
        headings: this.headings,
        sortable: this.sortableColumns,
        filterable: false,
        columnsClasses: {
          actions: 'table-actions'
        }
      }
    },
    async search () {
      await marketplaceAPI.search({
        data: {
          rules: this.rules
        },
        success: response => {
          this.pagination = response.data.pagination
          this.results = response.data.result
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    changedRules (rules) {
      this.rules = rules

      console.log('Changed rules to ', this.rules)

      this.search()
    }
  },
  metaInfo: {
    title: 'Marketplace'
  },
  components: {
    top,
    paginator,
    filters
  }
}
</script>

<style lang="scss" scoped>
  .engine {
    display: flex;

    > .filters {
      width: 200px;
    }

    > .datatable {
      flex: 1;
    }
  }
</style>
