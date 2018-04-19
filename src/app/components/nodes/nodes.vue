<template>
  <div>
    <top title="Nodes"></top>
    <div v-if="groups && !loading">
      <div v-if="groups.result.length" class="list">
        <div class="nodes-sidebar">
          <div v-for="group in groups.result" class="node-group" :key="group.id" @click.prevent.stop="initGroup(group, 1)" :class="selectedGroup === group.id ? 'active' : ''">
            <div class="description">
              <div class="group-name">Group #{{ group.id }}</div>
              <div class="count">{{ group.nodes.length }} Nodes</div>
            </div>
            <div class="actions">
              <a href="#edit" class="action-edit" @click.prevent.stop="editGroup(group.id)">Edit</a>
              <a href="#delete" class="action-remove" @click.prevent.stop="removeGroup(group.id)">Delete</a>
            </div>
          </div>

          <div class="node-group" v-if="uncategorizedNodes && uncategorizedNodes.result.length" @click="initUncategorizedNodes(1)" :class="selectedGroup === 0 ? 'active' : ''">
            <div class="description">
              <div class="group-name">Uncategorized</div>
              <div class="count">{{ uncategorizedNodes.pagination.total }} Nodes</div>
            </div>
          </div>
        </div>
        <div class="nodes-details">
          <nodes-list
            :searchId="searchId"
            :pagination="pagination"
            :tableData="nodes"
            @changedPage="changedPage"
            @sortByColumn="sortByColumn"/>
        </div>
      </div>
      <not-found v-else type="nodes"></not-found>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodesList from './nodesList'
import nodeAPI from '@/app/api/node.js'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import filtersMixin from '@/app/mixins/listFilters'

export default {
  mixins: [filtersMixin],
  data () {
    return {
      loading: true,
      perPage: 10,
      groups: null,
      selectedGroup: null,
      nodes: null,
      uncategorizedNodes: null
    }
  },
  metaInfo: {
    title: 'Nodes'
  },
  async created () {
    await this.fetchAll()
  },
  methods: {
    updateList (id, page) {
      console.warn('updateList', id, page)
      if (id === 'uncategorized') {
        this.fetchUncategorized(page)
      } else {
        this.fetchNodes(page)
      }
    },
    changedPage (page) {
      this.$router.push({ name: 'nodesByGroup', params: { id: (this.selectedGroup === 0) ? 'uncategorized' : this.selectedGroup, page: page } })
    },
    initGroup (group, page) {
      this.nodes = group.nodes
      this.selectedGroup = group.id

      if (this.$route.params.id !== group.id || this.$route.params.page !== page) {
        this.$router.push({ name: 'nodesByGroup', params: { id: group.id, page: 1 } })
      }
    },
    initUncategorizedNodes (page) {
      if (this.uncategorizedNodes) {
        this.nodes = this.uncategorizedNodes.result
        this.pagination = this.uncategorizedNodes.pagination
        this.selectedGroup = 0

        if (this.$route.params.id !== 'uncategorized' || this.$route.params.page !== page) {
          this.$router.push({ name: 'nodesByGroup', params: { id: 'uncategorized', page: 1 } })
        }
      }
    },
    async fetchAll () {
      await this.fetchGroups(1)
      await this.fetchUncategorizedNodes(1)

      this.handleGroupSelection()
    },
    fetch (page) {
      console.log('on fetch with selectedGroup', this.selectedGroup)

      if (this.selectedGroup !== 0) {
        this.removeFilter('=')

        this.rules.push({
          field: 'group_id',
          operator: '=',
          value: parseInt(this.selectedGroup)
        })

        this.search(page)
      }
    },
    async search (page) {
      console.log('on search')
      if (this.rules.length) {
        await nodeAPI.search({
          rules: this.rules,
          success: async response => {
            if (response.data.result.searchId) {
              this.searchId = response.data.result.searchId
            }

            this.fetchNodes(page)
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
        })
      } else {
        this.searchId = null
        this.fetchNodes(page)
      }
    },
    async fetchNodes (page) {
      // Attempt to find and replace the list of nodes of the current group with
      // the newly sorted one
      const index = this.groups.result.findIndex(g => g.id === this.selectedGroup)

      if (index !== -1) {
        console.log('fetching my nodes with this.searchId', this.searchId)
        await nodeAPI.myNodes({
          searchId: this.searchId,
          page: page,
          limit: this.perPage,
          success: response => {
            this.$set(this.groups.result[index], 'nodes', response.data.result)

            this.nodes = response.data.result
            this.pagination = response.data.pagination
            console.log('re set this.nodes with', this.nodes)
          },
          fail: (e) => {
            console.log(e)
            // this.error404()
          }
        })
      }
    },
    async fetchGroups () {
      await nodeAPI.groups({
        success: response => {
          this.groups = response.data
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    async fetchUncategorizedNodes (page) {
      await nodeAPI.uncategorizedNodes({
        page: page,
        limit: 10,
        success: response => {
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

      if (this.groups && this.groups.result.length) {
        const groups = this.groups.result

        // Attempt to pick the first node group with nodes
        for (let g = 0; g < groups.length; g++) {
          if (groups[g].nodes && groups[g].nodes.length) {
            found = true
            this.initGroup(groups[0], 1)
            break
          }
        }
      }

      // No nodes found in ANY node group? Load uncategorized nodes by default
      if (!found) {
        this.initUncategorizedNodes(1)
      }

      this.loading = false
    },
    handleGroupSelection () {
      // If coming from a route with a node group id, use that id
      if (this.$route.params.id) {
        if (this.$route.params.id && this.$route.params.id === 'uncategorized') {
          this.initUncategorizedNodes(1)
        } else {
          const target = this.groups.result.find(g => g.id === parseInt(this.$route.params.id))

          if (!target) {
            this.error404()
          } else {
            this.initGroup(target, 1)
          }
        }

        this.loading = false
        return
      }

      // Select default group if no id exists
      this.selectDefaultGroup()
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
    }
  },
  watch: {
    '$route': {
      handler (n, o) {
        // this.updateList(n.params.id, n.params.page)
      },
      deep: true,
      immediate: false
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
