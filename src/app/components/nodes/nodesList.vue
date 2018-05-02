<template>
  <div v-if="tableData && !loadingUncategorized && !loadingNodes">
    <header>
      <h2>{{ !groupData.uncategorized ? groupData.friendly_name : 'Uncategorized' }}</h2>
      <div v-if="!groupData.uncategorized" class="actions">
        <button @click.prevent.stop="removeGroup" class="button button-sm button-danger button-icon"><span class="icon-trash-2"></span></button>
        <button @click.prevent.stop="editGroup" class="button button-sm">Edit Group</button>
      </div>
    </header>
    <div v-if="tableData.length > 0" class="datatable">
      <table>
        <table-header :columns="columns" :headings="headings" :sortable="sortable" @sortByColumn="sortByColumn"/>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td>
              <div>{{ row.friendly_name }}</div>
              <div class="ip">{{ row.ip }}</div>
            </td>
            <td>
              <div class="service-badges">
                <div v-for="service in row.services" :key="service.id">
                  {{ service.type }}
                </div>
              </div>
            </td>
            <td>{{ $i18n.t(`nodes.MODEL.${row.market_model}`) }}</td>
            <td>
              <div :class="'badge status-' + row.status">
                {{ $i18n.t(`nodes.STATUS.${row.status}`) }}
              </div>
            </td>
            <td>
              <button v-if="row.status === 'unconfirmed'" class="button button-sm" @click.stop="verifyNode(row)">
                {{ $i18n.t('misc.VERIFY') }}
              </button>

              <router-link class="button button-icon" :to="{ name: 'manage', params: { nodeId: 101 } }">
                <span class="icon-settings"></span>
              </router-link>

              <button class="button button-icon" @click.stop="removeNode(row.id)">
                <span class="icon-trash-2"></span>
              </button>

              <router-link class="button button-icon" :to="{ name: 'node', params: { action: 'edit', id: row.id } }">
                <span class="icon-edit-2"></span>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert-msg-centered">
      <div class="icon-alert-circle big-icon"></div>
      <h1>No Nodes</h1>
      <p>There are no nodes to display in this node group.</p>
    </div>
    <paginator :pagination="pagination" @changedPage="changedPage"></paginator>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node.js'
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  props: {
    searchId: {
      type: String,
      default: null
    },
    loadingUncategorized: Boolean,
    loadingNodes: Boolean,
    pagination: Object,
    tableData: Array,
    groupData: Object
  },
  data () {
    return {
      columns: ['friendly_name', 'services', 'market_model', 'status', 'actions'],
      sortable: ['friendly_name', 'market_model', 'status'],
      headings: {
        friendly_name: 'Name',
        services: 'Services',
        status: 'Status',
        market_model: 'Market Model',
        actions: ''
      }
    }
  },
  methods: {
    sortByColumn (data) {
      this.$emit('sortByColumn', data)
    },
    changedPage (page) {
      this.$emit('changedPage', page)
    },
    removeNode (id) {
      if (confirm(this.$i18n.t('misc.DELETE_CONFIRM_DIALOG', { object: 'node' }))) {
        nodeAPI.delete({
          data: {
            id: id
          },
          success: response => {
            this.$emit('refetch')
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
        success: async response => {
          this.$emit('refetch')
          this.$toasted.success(this.$i18n.t('nodes.NODE_VERIFY_SUCCESS', { node: node.friendly_name }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
      })
    },
    editGroup () {
      this.$router.push({ name: 'groupEdit', params: { id: this.groupData.id } })
    },
    removeGroup () {
      if (confirm(this.$i18n.t('nodes.DELETE_GROUP_CONFIRM_DIALOG'))) {
        nodeAPI.deleteGroup({
          data: {
            id: this.groupData.id
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
    paginator,
    tableHeader
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $pad;
  padding-bottom: $pad;
  border-bottom: 1px solid $color-border;

  h2 {
    margin-bottom: 0;
    font-weight: $font-semi;
  }
}

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

.ip {
  margin-top: 4px;
  font-size: 12px;
  color: $color-light;
}

.badge {
  &.status-CONFIRMED {
    @extend .badge-success;
  }

  &.status-UNCONFIRMED {
    @extend .badge-error;
  }
}
</style>
