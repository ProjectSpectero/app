<template>
  <div>
    <top :title="$i18n.t('misc.NODES')"></top>
    <div v-if="groups">
      <div v-if="groups.length" class="list">
        <div class="content-split">
          <div class="split-item split-list nodes-sidebar">
            <div v-for="group in groups" class="node-group" :key="group.id" @click.prevent.stop="initGroup(group, true)" :class="selectedGroup === group.id ? 'active' : ''">
              <div class="group-name">
                {{ group.friendly_name }}
              </div>
              <div class="count">
                {{ group.nodes.length }}
              </div>
            </div>
            <div class="node-group" v-if="uncategorizedNodes && uncategorizedNodes.result.length" @click="initUncategorizedNodes" :class="selectedGroup === 0 ? 'active' : ''">
              <div class="group-name">
                {{ $i18n.t('nodes.UNCATEGORIZED') }}
              </div>
              <div class="count">
                {{ uncategorizedNodes.pagination.total }}
              </div>
            </div>
          </div>
          <div class="split-item split-details">
            <template v-if="groups && loading">
              <loading></loading>
            </template>
            <template v-else>
              <nodes-list
                :selectedGroupInformation="selectedGroupInformation"
                :loading="loading"
                :searchId="searchId"
                :pagination="pagination"
                :tableData="nodes"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn" />
            </template>
          </div>
        </div>
      </div>
      <not-found v-else :msg="$i18n.t('misc.NOT_FOUND', { type: 'nodes' })"></not-found>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodesList from './nodesList'
import nodeAPI from '@/app/api/node'
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
    await this.fetchUncategorizedNodes(this.currentPage)
    this.handleGroupSelection()
  },
  computed: {
    selectedGroupInformation () {
      const found = this.groups.find(u => u.id === this.selectedGroup)

      return {
        id: found ? found.id : 0,
        friendly_name: found ? found.friendly_name : this.$i18n.t('nodes.UNCATEGORIZED')
      }
    }
  },
  methods: {
    changedPage (page) {
      this.$router.push({ name: 'nodesByGroup', params: { id: (this.selectedGroup === 0) ? 'uncategorized' : this.selectedGroup, page: page } })
      this.fetch(page)

      if (this.selectedGroup === 0) {
        this.nodes = this.uncategorizedNodes.result
        this.pagination = this.uncategorizedNodes.pagination
      }
    },
    initGroup (group, reset) {
      this.selectedGroup = group.id
      this.fetch(reset ? 1 : this.currentPage)
      this.$router.push({ name: 'nodesByGroup', params: { id: group.id, page: 1 } })
    },
    initUncategorizedNodes () {
      this.selectedGroup = 0
      this.fetch(this.currentPage)
      this.nodes = this.uncategorizedNodes.result
      this.pagination = this.uncategorizedNodes.pagination
      this.loading = false
      this.$router.push({ name: 'nodesByGroup', params: { id: 'uncategorized', page: this.currentPage } })
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

      this.loading = true

      if (index !== -1) {
        console.log('fetching my nodes with this.searchId', this.searchId)
        await nodeAPI.myNodes({
          searchId: this.searchId,
          page: page,
          limit: 2, // this.perPage,
          success: response => {
            this.nodes = response.data.result
            this.pagination = response.data.pagination
            this.loading = false
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
        limit: 2, // this.perPage,
        success: response => {
          this.uncategorizedNodes = response.data
          console.log('Finished fetching uncategorizedNodes')
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
          groupsPage: this.groupsPage,
          success: response => {
            const pagination = response.data.pagination
            this.totalGroups = pagination.total
            this.processedGroups = this.processedGroups + response.data.result.length
            this.groupsPage++
            this.groups = this.groups ? [...this.groups, ...response.data.result] : response.data.result
            console.log('Finished fetching groups')
          },
          fail: (e) => {
            console.log(e)
            // this.error404()
          }
        })
      }
    },
    handleGroupSelection () {
      const id = this.$route.params.id

      // If coming from a route with a node group id, use that id.
      // Otherwise, select the first group.
      if (id) {
        if (id === 'uncategorized') {
          this.selectedGroup = 0
          this.nodes = this.uncategorizedNodes.result
          this.pagination = this.uncategorizedNodes.pagination
          this.loading = false
        } else {
          const target = this.groups.find(g => g.id === parseInt(id))

          if (!target) {
            this.error404()
          } else {
            this.initGroup(target, false)
          }
        }
      } else {
        if (this.groups[0] !== undefined) {
          this.initGroup(this.groups[0], false)
        }
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
</style>
