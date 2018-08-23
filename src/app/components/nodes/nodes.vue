<template>
  <div>
    <template v-if="!error">
      <top :title="$t('misc.NODES')">
        <router-link
          :to="{ name: 'nodesGroupCreate' }"
          class="button">
          <span class="icon-plus"/>{{ $t('nodes.CREATE_GROUP') }}
        </router-link>

        <button
          class="button-success"
          @click.prevent="showAddNodeModal()">
          <span class="icon-plus"/>{{ $t('nodes.ADD_NODE') }}
        </button>

        <help-button obj="nodes.topics"/>
      </top>

      <div>
        <div class="container">
          <div
            v-if="groups && everythingLoaded"
            class="col-12 content-split">
            <div
              v-if="groups && groups.length"
              class="split-list nodes-sidebar">
              <header>
                <h2 class="mb-0">{{ $t('misc.GROUPS') }}</h2>
              </header>
              <div
                v-for="group in groups"
                :key="group.id"
                :class="selectedGroup === group.id ? 'active' : ''"
                class="node-group"
                @click.stop="selectGroup(group, true)">
                <div class="group-name">
                  {{ group.friendly_name }}
                </div>
                <!-- <div class="count">
                  0
                </div> -->
              </div>

              <div
                :class="selectedGroup === 0 ? 'active' : ''"
                class="node-group"
                @click.stop="selectUncategorized">
                <div class="group-name">
                  {{ $t('nodes.UNCATEGORIZED') }}
                </div>
                <div class="count">
                  {{ uncategorized.pagination.total }}
                </div>
              </div>
            </div>
            <div class="split-details">
              <nodes-list
                :selected-group-information="selectedGroupInformation"
                :search-id="searchId"
                :pagination="(selectedGroup === 0) ? uncategorized.pagination : pagination"
                :table-data="(selectedGroup === 0) ? uncategorized.result : nodes"
                :hide-header="groups && groups.length === 0"
                :groups="groups"
                @refetch="setup"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn"
                @showAddNodeModal="showAddNodeModal"/>
            </div>
          </div>
          <loading
            v-else
            :text="loadingText" />
        </div>
      </div>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import filtersMixin from '@/app/mixins/listFilters'
import nodeAPI from '@/app/api/node'
import nodesList from './nodesList'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import helpButton from '@/shared/components/docs/button'
import addNodeModal from './addNodeModal'

export default {
  components: {
    top,
    error,
    loading,
    helpButton,
    notFound,
    nodesList,
    addNodeModal
  },
  mixins: [
    filtersMixin
  ],
  metaInfo: {
    title: 'Nodes'
  },
  data () {
    return {
      loadingGroups: true,
      loadingNodes: true,
      loadingUncategorized: true,
      perPage: 10,
      selectedGroup: 0,
      groups: null,
      totalGroups: null,
      processedGroups: 0,
      groupsPage: 1,
      nodes: [],
      uncategorized: {
        pagination: {},
        result: []
      },
      errorItem: 'list of nodes',
      fetchSuccessful: false
    }
  },
  computed: {
    selectedGroupInformation () {
      if (this.groups) {
        const found = this.groups.find(u => u.id === this.selectedGroup)

        return {
          id: found ? found.id : 0,
          friendly_name: found ? found.friendly_name : this.$t('nodes.UNCATEGORIZED')
        }
      }
    },
    everythingLoaded () {
      return (!this.loadingGroups && !this.loadingNodes && !this.loadingUncategorized)
    },
    loadingText () {
      let str = null

      if (this.loadingGroups) {
        str = 'Loading node groups ...'
      } else if (this.loadingNodes) {
        str = 'Loading nodes ...'
      } else if (this.loadingUncategorized) {
        str = 'Loading uncategorized nodes ...'
      }

      return str
    }
  },
  async created () {
    await this.setup()
  },
  methods: {
    async setup () {
      this.reset()

      await this.fetchUncategorized(this.currentPage)
      await this.fetchGroups()

      this.handleSelection()
    },
    reset () {
      this.groups = null
      this.totalGroups = null
      this.processedGroups = 0
      this.groupsPage = 1
      this.nodes = []
      this.uncategorized = {
        pagination: {},
        result: []
      }
    },
    handleSelection () {
      const id = this.$route.params.id

      // If coming from a route with a node group id, use that id.
      // Otherwise, select the first group.
      if (id) {
        if (id === 'uncategorized') {
          this.selectUncategorized()
        } else {
          if (this.groups) {
            const target = this.groups.find(g => g.id === parseInt(id))

            if (!target) {
              this.error = true
            } else {
              this.selectGroup(target, false)
            }
          } else {
            // No groups found? Stop loading nodes and show the not found screen
            this.loadingNodes = false
          }
        }
      } else {
        let found = false

        if (!found && this.groups.length > 0) {
          this.selectGroup(this.groups[0], false)
        } else {
          // No groups found? Stop loading nodes and show the not found screen
          this.loadingNodes = false
        }
      }
    },
    changedPage (page) {
      this.fetch(page)
      this.$router.push({ name: 'nodesByGroup', params: { id: (this.selectedGroup === 0) ? 'uncategorized' : this.selectedGroup, page: page } })
    },
    selectGroup (group, reset) {
      this.selectedGroup = group.id
      this.changedPage(reset ? 1 : this.currentPage)
    },
    selectUncategorized () {
      this.selectedGroup = 0
      this.changedPage(this.currentPage)
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
              this.error = false
            }

            if (this.selectedGroup !== 0) {
              await this.fetchNodes(page)
            } else {
              await this.fetchUncategorized(page)
              this.loadingNodes = false
            }
          },
          fail: e => {
            console.error(e)
            this.error = true
          }
        })
      } else {
        this.searchId = null

        if (this.selectedGroup !== 0) {
          await this.fetchNodes(page)
        } else {
          await this.fetchUncategorized(page)
          this.loadingNodes = false
        }
      }
    },
    async fetchNodes (page) {
      // Attempt to find and replace the list of nodes of the current group with
      // the newly sorted one
      const index = this.groups.findIndex(g => g.id === this.selectedGroup)

      if (index !== -1 && !isNaN(page)) {
        await nodeAPI.myNodes({
          queryParams: {
            searchId: this.searchId,
            page: page,
            perPage: this.perPage || 10
          },
          success: response => {
            this.nodes = response.data.result
            this.pagination = response.data.pagination
            this.loadingNodes = false
            this.error = false
          },
          fail: e => {
            console.log(e)
            this.error = true
            this.errorCode = 400
          }
        })
      } else {
        this.error = true
        this.errorCode = 400
      }
    },
    async fetchUncategorized (page) {
      if (!isNaN(page)) {
        await nodeAPI.uncategorizedNodes({
          queryParams: {
            searchId: this.searchId,
            page: page || 1,
            perPage: this.perPage || 10
          },
          success: response => {
            this.uncategorized = response.data
            this.loadingUncategorized = false
            this.fetchSuccessful = true
          },
          fail: e => {
            console.error(e)
            this.error = true
            this.errorCode = 400
          }
        })
      } else {
        this.error = true
        this.errorCode = 400
      }
    },
    async fetchGroups () {
      // Group fetching is paged in chunks of 10, so we need to keep
      // fetching until we reach the total amount (received in pagination)
      if (this.fetchSuccessful) {
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
              this.error = false
              this.loadingGroups = false
            },
            fail: e => {
              console.error(e)
              this.error = true
              this.errorCode = 400
            }
          })
        }
      }
    },
    showAddNodeModal () {
      this.$modal.show(addNodeModal, {}, {
        height: 'auto'
      })
    }
  }
}
</script>
