<template>
  <div>
    <top title="Nodes"></top>

    <div v-if="groups && !loading">
      <div v-if="groups.result.length" class="list">
        <div class="nodes-sidebar">
          <div v-for="group in groups.result" class="node-group" :key="group.id" @click.prevent.stop="selectGroup(group)" :class="selectedGroup === group.id ? 'active' : ''">
            <div class="description">
              <div class="group-name">Group #{{ group.id }}</div>
              <div class="count">{{ group.nodes.length }} Nodes</div>
            </div>
            <div class="actions">
              <a href="#edit" class="action-edit" @click.prevent.stop="editGroup(group.id)">Edit</a>
              <a href="#delete" class="action-remove" @click.prevent.stop="removeGroup(group.id)">Delete</a>
            </div>
          </div>

          <div class="node-group" v-if="uncategorizedNodes.result && uncategorizedNodes.result.length" @click="selectUncategorizedNodes" :class="selectedGroup === 0 ? 'active' : ''">
            <div class="description">
              <div class="group-name">Uncategorized</div>
              <div class="count">{{ uncategorizedNodes.pagination.total }} Nodes</div>
            </div>
          </div>
        </div>
        <div class="nodes-details">
          <nodes-list
            v-if="nodes"
            :nodes="nodes"
            :options="options"
            :columns="columns"
            :pagination="pagination"
            :serverPagination="selectedGroup === 0"
            @changedPage="fetchUncategorized"
            @refetch="fetchAll"
          />
        </div>
      </div>
      <not-found v-else type="nodes"></not-found>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import nodesList from './nodesList'
import nodeAPI from '@/app/api/node.js'

export default {
  data () {
    return {
      pagination: null,
      loading: true,
      groups: null,
      selectedGroup: null,
      nodes: null,
      uncategorizedPage: 1,
      uncategorizedNodes: null,
      columns: ['name', 'market_model', 'status', 'actions'],
      sortableColumns: ['name', 'status', 'market_model'],
      filterableColumns: ['name', 'status', 'market_model'],
      headings: {
        friendly_name: 'Name',
        ip: 'IP Address',
        status: 'Status',
        market_model: 'Market Model',
        updated_at: 'Creation Date',
        actions: ''
      },
      options: {}
    }
  },
  metaInfo: {
    title: 'Nodes'
  },
  created () {
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

    this.fetchAll()
  },
  methods: {
    selectGroup (group) {
      this.$set(this.options.texts, 'count', 'Showing {from} to {to} of {count} nodes|{count} nodes|One node')
      this.$set(this.options, 'pagination', true)
      this.$set(this.options, 'perPage', 10)

      this.nodes = group.nodes
      this.selectedGroup = group.id

      this.$router.push({ name: 'nodesByGroup', params: { id: group.id } })
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

      this.$router.push({ name: 'nodesByGroup', params: { id: 'uncategorized' } })
    },
    editGroup (id) {
      this.$router.push({ name: 'groupEdit', params: { id: id } })
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
    async fetchAll () {
      await this.fetchNodes()
      await this.fetchUncategorized(this.uncategorizedPage)
      this.handleGroupSelection()
    },
    async fetchNodes () {
      await nodeAPI.groups({
        limit: 100,
        success: response => {
          this.groups = response.data
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    async fetchUncategorized (page) {
      await nodeAPI.uncategorizedNodes({
        page: page,
        limit: 10,
        success: response => {
          this.uncategorizedPage = page
          this.uncategorizedNodes = response.data
          this.nodes = response.data.result
          this.pagination = response.data.pagination
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    selectDefaultGroup () {
      let found = false
      const groups = this.groups.result

      // Attempt to pick the first node group with nodes
      for (let g = 0; g < groups.length; g++) {
        if (groups[g].nodes && groups[g].nodes.length) {
          found = true
          this.selectGroup(groups[0])
          break
        }
      }

      // No nodes found in ANY node group? Load uncategorized nodes by default
      if (!found) {
        this.selectUncategorizedNodes()
      }

      this.loading = false
    },
    handleGroupSelection () {
      // If coming from a route with a node group id, use that id
      if (this.$route.params.id) {
        if (this.$route.params.id && this.$route.params.id === 'uncategorized') {
          this.selectUncategorizedNodes()
        } else {
          const target = this.groups.result.find(g => g.id === parseInt(this.$route.params.id))

          if (!target) {
            this.error404()
          } else {
            this.selectGroup(target)
          }
        }

        this.loading = false
        return
      }

      // Select default group if no id exists
      this.selectDefaultGroup()
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
  margin-bottom: $pad;
  background: #fff;
}

.nodes-sidebar {
  width: 300px;
  margin-right: $pad;
  border-bottom: 0;

  > div {
    height: 60px;
    padding: 1rem;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background-color: rgba(9, 30, 66, 0.04);
    }
  }
}

.nodes-details {
  flex: 1;
}

.node-group {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .description {
    flex: 1;
  }
  .actions {
    a {
      padding-left: 6px;

      &:first-child {
        margin-left: 0;
      }
    }

    .action-remove {
      color: $color-danger;
    }
  }
  .group-name {
    font-size: 16px;
    font-weight: $font-semi;
  }
  .count {
    margin-top: 4px;
    font-size: 12px;
    color: $color-light;
  }
}
</style>
