<template>
  <div>
    <top title="Nodes"></top>

    <div v-if="groups && !loading">
      <div v-if="groups.length" class="list pad-margin">
        <div class="left">
          <div v-for="group in groups" :key="group.id" @click="selectGroup(group)" :class="selectedGroup === group.id ? 'active' : ''">
            <div class="node-group">
              <div class="group-name">Group #{{ group.id }}</div>

              <div class="group-actions">
                <router-link :to="{ name: 'group', params: { id: group.id } }">Edit</router-link>
                <a href="#" @click.prevent.stop="removeGroup(group.id)">Remove</a>
              </div>
            </div>

            <small>({{ group.nodes.length }} nodes)</small>
          </div>

          <div v-if="uncategorizedNodes && uncategorizedNodes.length" @click="selectUncategorizedNodes" :class="selectedGroup === 0 ? 'active' : ''">
            <div class="node-group">
              <div class="group-name">Uncategorized</div>
            </div>
            <small>({{ uncategorizedNodes.length }} nodes)</small>
          </div>
        </div>
        <div class="right">
          <div v-if="nodes" class="datatable">
            <v-client-table :data="nodes" :columns="columns" :options="options">
              <template slot="name" slot-scope="props">
                <div>{{ props.row.friendly_name }}</div>
                <small>{{ props.row.ip }}</small>
              </template>

              <template slot="services" slot-scope="props">
                <div v-for="service in props.row.services" :key="service.id">
                  {{ service.type }}
                </div>
              </template>

              <template slot="status" slot-scope="props">
                <div :class="'status-' + props.row.status">
                  <span v-if="props.row.status !== 'pending_verification'">
                    {{ props.row.status[0].toUpperCase() + props.row.status.slice(1) }}
                  </span>
                  <span v-else>
                    Pending Verification
                  </span>
                </div>
              </template>

              <template slot="actions" slot-scope="props">
                <router-link class="button" :to="{ name: 'node', params: { action: 'view', id: props.row.id } }">
                  {{ $i18n.t('misc.VIEW') }}
                </router-link>

                <router-link class="button" :to="{ name: 'node', params: { action: 'edit', id: props.row.id } }">
                  {{ $i18n.t('misc.EDIT') }}
                </router-link>

                <button class="button" @click.stop="removeNode(props.row.id)">Remove</button>

                <button v-if="props.row.status === 'unconfirmed'" class="button" @click.stop="verifyNode(props.row)">
                  {{ $i18n.t('misc.VERIFY') }}
                </button>
              </template>
            </v-client-table>
          </div>
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
import nodeAPI from '@/api/node.js'

export default {
  metaInfo: {
    title: 'Nodes'
  },
  data () {
    return {
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
    await this.fetchUncategorized()

    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} nodes|{count} nodes|One node',
        filter: '',
        filterPlaceholder: 'Search nodes',
        limit: 'Nodes:',
        page: 'Page:',
        noResults: 'This node group has no nodes yet.',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      columnsClasses: {
        actions: 'table-actions'
      },
      perPage: 100,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }
  },
  methods: {
    selectGroup (group) {
      this.nodes = group.nodes
      this.selectedGroup = group.id
    },
    selectUncategorizedNodes () {
      this.nodes = this.uncategorizedNodes
      this.selectedGroup = 0
    },
    removeNode (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_CONFIRM_DIALOG'))) {
        nodeAPI.delete({
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
    verifyNode (node) {
      nodeAPI.verify({
        data: {
          id: node.id
        },
        success: response => {
          this.fetchNodes()
          this.$toasted.success(this.$i18n.t('nodes.NODE_VERIFY_SUCCESS', { node: node.friendly_name }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
      })
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
        success: async response => {
          if (response.data.result) {
            this.groups = response.data.result

            // Select first node group
            for (let g = 0; g < this.groups.length; g++) {
              if (this.groups[g].nodes && this.groups[g].nodes.length) {
                this.selectGroup(this.groups[0])
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
    fetchUncategorized () {
      nodeAPI.uncategorizedNodes({
        success: response => {
          this.uncategorizedNodes = response.data.result

          if (!this.nodes && this.uncategorizedNodes.length) {
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
    notFound
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

    .nodes {
      > div {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: 1px solid #ddd;

        .actions {
          margin-left: auto;
        }
      }
    }
  }

  .node-group {
    display: flex;

    > .group-name {
      flex: 1;
    }
  }
</style>
