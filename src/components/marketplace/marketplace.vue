<template>
  <div>
    <top title="Marketplace"></top>

    <div class="engine">
      <filters @changedFilters="filtersChanged"></filters>

      <div class="datatable">
        <v-client-table :data="results" :columns="columns" :options="options">
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
      columns: ['id', 'friendly_name'],
      sortableColumns: ['id', 'friendly_name'],
      headings: {
        id: 'Invoice ID',
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
        rules: this.rules,
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
    filtersChanged (filters) {
      this.rules = {
        rules: filters
      }

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
