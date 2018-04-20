<template>
  <div>
    <top title="Nodes"></top>
    <div v-if="groups && !loading">
      <div v-if="groups.length" class="list">
        <div class="nodes-sidebar">
          <div v-for="group in groups" class="node-group" :key="group.id" @click.prevent.stop="initGroup(group)" :class="selectedGroup === group.id ? 'active' : ''">
            <div class="description">
              <div class="group-name">{{ group.friendly_name }}</div>
              <div class="count">{{ group.nodes.length }} Nodes</div>
            </div>
            <div class="actions">
              <a href="#edit" class="action-edit" @click.prevent.stop="editGroup(group.id)">Edit</a>
              <a href="#delete" class="action-remove" @click.prevent.stop="removeGroup(group.id)">Delete</a>
            </div>
          </div>

          <div class="node-group" v-if="uncategorizedNodes && uncategorizedNodes.result.length" @click="initUncategorizedNodes" :class="selectedGroup === 0 ? 'active' : ''">
            <div class="description">
              <div class="group-name">Uncategorized</div>
              <div class="count">{{ uncategorizedNodes.pagination.total }} Nodes</div>
            </div>
          </div>
        </div>
        <div class="nodes-details">
          <nodes-list
            :loading="loading"
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
      perPage: 2,
      selectedGroup: null,
      groups: null,
      totalGroups: null,
      processedGroups: 0,
      groupsPage: 1,
      nodes: null,
      uncategorizedNodes: null
    }
  },
  metaInfo: {
    title: 'Nodes'
  },
  async created () {
    await this.fetchGroups()
    await this.fetchUncategorizedNodes(1)
    this.handleGroupSelection()
  },
  methods: {
    changedPage (page) {
      this.$router.push({ name: 'nodesByGroup', params: { id: (this.selectedGroup === 0) ? 'uncategorized' : this.selectedGroup, page: page } })
      this.fetch(page)
    },
    initGroup (group) {
      this.selectedGroup = group.id
      this.changedPage(1)
    },
    initUncategorizedNodes () {
      this.selectedGroup = 0
      this.changedPage(1)
    },
    fetch (page) {
      this.removeFilter('=')

      // We only need to match the group_id when querying for nodes in groups,
      // uncategorized nodes have their own group (so to speak)
      if (this.selectedGroup !== 0) {
        this.rules.push({
          field: 'group_id',
          operator: '=',
          value: parseInt(this.selectedGroup)
        })
      }

      this.search(page)
    },
    async search (page) {
      if (this.rules.length) {
        await nodeAPI.search({
          rules: this.rules,
          success: async response => {
            if (response.data.result.searchId) {
              this.searchId = response.data.result.searchId
            }

            if (this.selectedGroup !== 0) {
              this.fetchNodes(page)
            } else {
              this.fetchUncategorizedNodes(page)
            }
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'errors'))
        })
      } else {
        this.searchId = null

        if (this.selectedGroup !== 0) {
          this.fetchNodes(page)
        } else {
          this.fetchUncategorizedNodes(page)
        }
      }
    },
    async fetchNodes (page) {
      // Attempt to find and replace the list of nodes of the current group with
      // the newly sorted one
      const index = this.groups.findIndex(g => g.id === this.selectedGroup)

      if (index !== -1) {
        console.log('fetching my nodes with this.searchId', this.searchId)
        await nodeAPI.myNodes({
          searchId: this.searchId,
          page: page,
          limit: this.perPage,
          success: response => {
            this.nodes = response.data.result
            this.pagination = response.data.pagination
            console.log('myNodes pagination', response.data.pagination)
          },
          fail: (e) => {
            console.log(e)
            // this.error404()
          }
        })
      }
    },
    async fetchUncategorizedNodes (page) {
      await nodeAPI.uncategorizedNodes({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
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
    async fetchGroups () {
      // Group fetching is paged in chunks of 10, so we need to keep
      // fetching until we reach the total amount (received in pagination)
      while (this.totalGroups === null || this.totalGroups !== this.processedGroups) {
        await nodeAPI.groups({
          perPage: 10,
          page: this.groupsPage,
          success: response => {
            const pagination = response.data.pagination
            this.totalGroups = pagination.total
            this.processedGroups = this.processedGroups + response.data.result.length
            this.groupsPage++
            this.groups = this.groups ? [...this.groups, ...response.data.result] : response.data.result
          },
          fail: (e) => {
            console.log(e)
            // this.error404()
          }
        })
      }
    },
    handleGroupSelection () {
      // If coming from a route with a node group id, use that id
      if (this.$route.params.id) {
        if (this.$route.params.id && this.$route.params.id === 'uncategorized') {
          this.initUncategorizedNodes()
        } else {
          const target = this.groups.find(g => g.id === parseInt(this.$route.params.id))

          if (!target) {
            this.error404()
          } else {
            this.initGroup(target)
          }
        }
      } else {
        // Select default group if no id exists
        this.selectDefaultGroup()
      }

      this.loading = false
    },
    selectDefaultGroup () {
      let found = false

      if (this.groups && this.groups.length) {
        // Attempt to pick the first node group with nodes
        for (let g = 0; g < this.groups.length; g++) {
          if (this.groups[g].nodes && this.groups[g].nodes.length) {
            found = true
            this.initGroup(this.groups[0])
            break
          }
        }
      }

      // No nodes found in ANY node group? Load uncategorized nodes by default
      if (!found) {
        this.initUncategorizedNodes()
      }
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
