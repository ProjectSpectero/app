<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('misc.NODES')">
        <help-button obj="nodes.topics"></help-button>
      </top>
      <div>
        <div class="container content-split">
          <div class="split-item split-list nodes-sidebar">
            <router-link class="button button-success mb-3" :to="{ name: 'groupCreate' }">
              <span class="icon-plus"></span>
              {{ $i18n.t('nodes.CREATE_GROUP') }}
            </router-link>

            <div v-if="groups">
              <div v-if="groups.length">
                <div v-for="group in groups" class="node-group" :key="group.id" @click.stop="selectGroup(group, true)" :class="selectedGroup === group.id ? 'active' : ''">
                  <div class="group-name">
                    {{ group.friendly_name }}
                  </div>
                  <div class="count">
                    {{ group.nodes.length }}
                  </div>
                </div>
                <div class="node-group" v-if="uncategorized && uncategorized.result.length" @click.stop="selectUncategorized" :class="selectedGroup === 0 ? 'active' : ''">
                  <div class="group-name">
                    {{ $i18n.t('nodes.UNCATEGORIZED') }}
                  </div>
                  <div class="count">
                    {{ uncategorized.pagination.total }}
                  </div>
                </div>
              </div>
              <not-found v-else type="nodes">
                <slot><p v-html="$i18n.t('nodes.NO_NODES_TEXT')"></p></slot>
              </not-found>
            </div>
            <loading v-else></loading>
          </div>
          <div class="split-item split-details">
            <template v-if="groups && loading">
              <loading></loading>
            </template>
            <template v-else>
              <nodes-list
                :selectedGroupInformation="selectedGroupInformation"
                :dataLoading="loading"
                :searchId="searchId"
                :pagination="(selectedGroup === 0) ? uncategorized.pagination : pagination"
                :tableData="(selectedGroup === 0) ? uncategorized.result : nodes"
                @changedPage="changedPage"
                @sortByColumn="sortByColumn" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
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

export default {
  mixins: [filtersMixin],
  metaInfo: {
    title: 'Nodes'
  },
  data () {
    return {
      perPage: 10,
      selectedGroup: null,
      groups: null,
      totalGroups: null,
      processedGroups: 0,
      groupsPage: 1,
      nodes: null,
      uncategorized: null,
      errorItem: 'nodes'
    }
  },
  async created () {
    await this.fetchGroups()
    await this.fetchUncategorized(this.currentPage)
    this.handleSelection()
  },
  computed: {
    selectedGroupInformation () {
      if (this.groups) {
        const found = this.groups.find(u => u.id === this.selectedGroup)

        return {
          id: found ? found.id : 0,
          friendly_name: found ? found.friendly_name : this.$i18n.t('nodes.UNCATEGORIZED')
        }
      }
    }
  },
  methods: {
    handleSelection () {
      const id = this.$route.params.id

      // If coming from a route with a node group id, use that id.
      // Otherwise, select the first group.
      if (id) {
        if (id === 'uncategorized') {
          this.selectUncategorized()
        } else {
          const target = this.groups.find(g => g.id === parseInt(id))

          if (!target) {
            this.error = true
          } else {
            this.selectGroup(target, false)
          }
        }
      } else {
        let found = false

        // Select the first group with nodes, if any.
        // Otherwise, just pick the first empty group.
        this.groups.forEach(g => {
          if (!found && g.nodes.length > 0) {
            this.selectGroup(g, false)
            found = true
          }
        })

        if (!found && this.groups.length > 0) {
          this.selectGroup(this.groups[0], false)
        }
      }
    },
    changedPage (page) {
      this.fetch(page)
      this.$router.push({ name: 'nodesByGroup', params: { id: (this.selectedGroup === 0) ? 'uncategorized' : this.selectedGroup, page: page } })
    },
    selectGroup (group, reset) {
      this.loading = true
      this.selectedGroup = group.id
      this.changedPage(reset ? 1 : this.currentPage)
    },
    selectUncategorized () {
      this.loading = true
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
              this.fetchNodes(page)
            } else {
              this.fetchUncategorized(page)
            }
          },
          fail: e => {
            console.log(e)
            this.error = true
          }
        })
      } else {
        this.searchId = null

        if (this.selectedGroup !== 0) {
          this.fetchNodes(page)
        } else {
          this.fetchUncategorized(page)
        }
      }
    },
    async fetchNodes (page) {
      // Attempt to find and replace the list of nodes of the current group with
      // the newly sorted one
      const index = this.groups.findIndex(g => g.id === this.selectedGroup)

      if (index !== -1) {
        await nodeAPI.myNodes({
          searchId: this.searchId,
          page: page,
          limit: this.perPage,
          success: response => {
            this.nodes = response.data.result
            this.pagination = response.data.pagination
            this.loading = false
            this.error = false
          },
          fail: e => {
            console.log(e)
            this.error = true
            this.errorCode = 400
          }
        })
      }
    },
    async fetchUncategorized (page) {
      await nodeAPI.uncategorizedNodes({
        searchId: this.searchId,
        page: page,
        limit: this.perPage,
        success: response => {
          this.uncategorized = response.data
          this.loading = false
        },
        fail: e => {
          console.log(e)
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
            this.error = false
          },
          fail: e => {
            console.log(e)
          }
        })
      }
    }
  },
  components: {
    top,
    error,
    loading,
    helpButton,
    notFound,
    nodesList
  }
}
</script>

<style lang="scss" scoped>

</style>
