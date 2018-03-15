<template>
  <div>
    <top title="Nodes"></top>

    <div v-if="groups && !loading">
      <div v-if="groups.result.length" class="list pad-margin">
        <div class="left">
          <div v-for="group in groups.result" :key="group.id" @click="selectGroup(group)" :class="selectedGroup === group.id ? 'active' : ''">
            <div class="node-group">
              <div class="group-name">Group #{{ group.id }}</div>

              <div class="group-actions">
                <router-link :to="{ name: 'group', params: { id: group.id } }">Edit</router-link>
                <a href="#" @click.prevent.stop="removeGroup(group.id)">Remove</a>
              </div>
            </div>

            <small>({{ group.nodes.length }} nodes)</small>
          </div>

          <div v-if="uncategorizedNodes.result && uncategorizedNodes.result.length" @click="selectUncategorizedNodes" :class="selectedGroup === 0 ? 'active' : ''">
            <div class="node-group">
              <div class="group-name">Uncategorized</div>
            </div>
            <small>({{ uncategorizedNodes.pagination.total }} nodes)</small>
          </div>
        </div>
        <div class="right">
          <nodes-list
            v-if="nodes"
            :nodes="nodes"
            :options="options"
            :columns="columns"
            :pagination="pagination"
            :serverPagination="selectedGroup === 0"
            @changedPage="fetchUncategorized"
          />
        </div>
      </div>
      <not-found v-else type="nodes"></not-found>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/components/common/top'
import loading from '@/components/common/loading'
import notFound from '@/components/common/notFound'
import nodesList from './nodesList'
import nodeAPI from '@/api/node.js'

export default {
  metaInfo: {
    title: 'Nodes'
  },
  data () {
    return {
      pagination: null,
      loading: true,
      groups: null,
      selectedGroup: null,
      nodes: null,
      uncategorizedNodes: null,
      columns: ['name', 'market_model', 'services', 'status', 'actions'],
      sortableColumns: ['name', 'status', 'market_model'],
      filterableColumns: ['name', 'status', 'market_model'],
      headings: {
        friendly_name: 'Name',
        ip: 'IP Address',
        status: 'Status',
        market_model: 'Model',
        updated_at: 'Creation Date',
        actions: 'Actions'
      },
      options: {}
    }
  },
  async created () {
    await this.fetchNodes()
    await this.fetchUncategorized(1)

    this.options = {
      skin: '',
      texts: {
        count: '',
        filter: '',
        filterPlaceholder: 'Search nodes',
        limit: 'Nodes:',
        page: 'Page:',
        noresult: 'This node group has no nodes yet.',
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
    selectGroup (group) {
      this.$set(this.options.texts, 'count', 'Showing {from} to {to} of {count} nodes|{count} nodes|One node')
      this.$set(this.options, 'pagination', true)
      this.$set(this.options, 'perPage', 10)

      this.nodes = group.nodes
      this.selectedGroup = group.id
    },
    selectUncategorizedNodes () {
      // Uncategorized nodes will use server-side pagination
      // so we need to disable a few options
      this.$set(this.options.texts, 'count', '')
      this.$set(this.options, 'pagination', false)
      this.$set(this.options, 'perPage', 10)

      this.nodes = this.uncategorizedNodes.result
      this.pagination = this.uncategorizedNodes.pagination
      this.selectedGroup = 0
    },
    removeGroup (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_GROUP_CONFIRM_DIALOG'))) {
        nodeAPI.deleteGroup({
          data: {
            id: id
          },
          success: response => {
            this.fetchNodes()
            this.$toasted.show(this.$i18n.t('nodes.GROUP_DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
        })
      }
    },
    fetchNodes (page) {
      nodeAPI.groups({
        limit: 100,
        success: async response => {
          if (response.data.result) {
            this.groups = response.data

            // Select first node group
            for (let g = 0; g < this.groups.result.length; g++) {
              if (this.groups.result[g].nodes && this.groups.result[g].nodes.length) {
                this.selectGroup(this.groups.result[0])
                break
              }
            }
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    fetchUncategorized (page) {
      nodeAPI.uncategorizedNodes({
        page: page,
        limit: 3,
        success: response => {
          this.uncategorizedNodes = response.data

          if (this.uncategorizedNodes.result.length) {
            this.selectUncategorizedNodes()
          }

          this.loading = false
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    }
  },
  components: {
    top,
    loading,
    notFound,
    nodesList
  }
}
</script>

<style lang="scss" scoped>
  .list {
    display: flex;
    background: #fff;
  }

  .left {
    width: 25%;
    border: 1px solid #ddd;
    border-bottom: 0;

    > div {
      border-bottom: 1px solid #ddd;
      height: 60px;
      padding: 1rem;
      cursor: pointer;
    }

    .active {
      background: #f9f9f9
    }
  }

  .right {
    width: 75%;
  }

  .node-group {
    display: flex;

    > .group-name {
      flex: 1;
    }
  }
</style>
