<template>
  <div>
    <top title="Nodes"></top>

    <div v-if="groups" class="list pad-margin">
      <div class="left">
        <div v-for="group in groups" :key="group.id" @click="selectGroup(group)" :class="{ selectedGroup: 'active' }">
          <div class="node-group">
            <div class="group-name">Group #{{ group.id }}</div>

            <div class="group-actions">
              <router-link :to="{ name: 'group', params: { id: group.id } }">Edit</router-link>
              <a href="#" @click.prevent.stop="removeGroup(group.id)">Remove</a>
            </div>
          </div>

          <small>({{ group.nodes.length }} nodes)</small>
        </div>
      </div>
      <div class="right">
        <div v-if="nodes" class="datatable">
          <v-client-table :data="nodes" :columns="columns" :options="options">
            <template slot="created_at" slot-scope="props">
              {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
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
              <router-link class="button" :to="{ name: 'node', params: { id: props.row.id } }">
                Edit
              </router-link>

              <button class="button" @click.stop="removeNode(props.row.id)">Remove</button>

              <button v-if="props.row.status === 'unconfirmed'" class="button" @click.stop="verifyNode(props.row)">
                Verify
              </button>
            </template>
          </v-client-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import nodeAPI from '@/api/node.js'

export default {
  components: {
    top
  },
  metaInfo: {
    title: 'Nodes'
  },
  data () {
    return {
      groups: null,
      selectedGroup: null,
      nodes: null,
      columns: ['friendly_name', 'ip', 'market_model', 'created_at', 'status', 'actions'],
      sortableColumns: ['friendly_name', 'ip', 'status', 'market_model', 'created_at'],
      filterableColumns: ['friendly_name', 'ip', 'status', 'market_model', 'created_at'],
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
  created () {
    this.fetchNodes()
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
      perPage: 10,
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }
  },
  methods: {
    selectGroup (group) {
      this.nodes = group.nodes
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
    fetchNodes () {
      nodeAPI.nodeGroups({
        success: response => {
          if (response.data.result) {
            this.groups = response.data.result

            // Select first node group
            if (this.groups.length) {
              this.selectGroup(this.groups[0])
            }
          }
        },
        fail: error => {
          const keys = Object.keys(error.errors)
          this.error = this.$i18n.t(`errors.${keys[0]}`)
        }
      })
    }
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
