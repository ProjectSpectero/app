<template>
  <div
    v-if="tableData && !dataLoading"
    class="section padded">
    <header v-if="!hideHeader">
      <h2 class="mb-0">{{ selectedGroupInformation.friendly_name }}</h2>
      <div
        v-if="selectedGroupInformation.id !== 0"
        class="actions">
        <button
          class="button-sm button-danger button-icon"
          @click.stop="removeGroup">
          <span class="icon-trash-2"/>
        </button>

        <button
          class="button-sm"
          @click.stop="editGroup">
          {{ $i18n.t('nodes.EDIT_GROUP') }}
        </button>
      </div>
    </header>
    <div
      v-if="tableData.length > 0"
      class="datatable">
      <table>
        <table-header
          :columns="columns"
          :headings="headings"
          :sortable="sortable"
          @sortByColumn="sortByColumn"/>
        <tbody>
          <tr
            v-for="row in tableData"
            :key="row.id">
            <td>
              <div>{{ row.friendly_name }}</div>
              <div class="ip">{{ row.ip }}</div>
            </td>
            <td>
              <div class="service-badges">
                <div
                  v-for="service in row.services"
                  :key="service.id">
                  {{ service.type }}
                </div>
              </div>
            </td>
            <td>{{ $i18n.t(`nodes.MODEL.${row.market_model}`) }}</td>
            <td>
              <div :class="'badge-' + row.status.toLowerCase()">
                {{ $i18n.t(`nodes.STATUS.${row.status}`) }}
              </div>
            </td>
            <td class="table-actions">
              <button
                v-if="row.status === 'UNCONFIRMED'"
                class="button-success button-sm"
                @click.stop="verifyNode(row)">
                <span class="icon-check"/> {{ $i18n.t('misc.VERIFY') }}
              </button>

              <router-link
                :to="{ name: 'manage', params: { nodeId: isDevelopmentEnvironment ? row.id : 101 } }"
                class="button-sm button-info">
                <span class="icon-sliders"/> Manage
              </router-link>

              <button
                class="button-icon"
                @click.stop="removeNode(row.id)">
                <span class="icon-trash-2"/>
              </button>

              <router-link
                :to="{ name: 'node', params: { action: 'edit', id: row.id } }"
                class="button-icon">
                <span class="icon-edit-2"/>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-else
      class="alert-msg-centered">
      <div class="icon-slash big-icon"/>
      <h1>{{ $i18n.t('nodes.NO_NODES_TITLE') }}</h1>
      <p>{{ $i18n.t('nodes.NO_NODES_TEXT') }}</p>
      <button
        class="button-success"
        @click.prevent="showAddNodeModal()">
        <span class="icon-plus"/>{{ $i18n.t('nodes.ADD_NODE') }}
      </button>
    </div>

    <paginator
      :pagination="pagination"
      @changedPage="changedPage"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node.js'
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  components: {
    paginator,
    tableHeader
  },
  props: {
    searchId: {
      type: String,
      required: false,
      default: null
    },
    dataLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    pagination: {
      type: Object,
      required: false,
      default: () => {}
    },
    tableData: {
      type: Array,
      required: true
    },
    selectedGroupInformation: {
      type: Object,
      required: false,
      default: () => {}
    },
    hideHeader: {
      type: Boolean,
      required: false,
      default: false
    }
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
  computed: {
    isDevelopmentEnvironment () {
      return (process.env.NODE_ENV !== 'development')
    }
  },
  methods: {
    sortByColumn () {
      this.$emit('sortByColumn')
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
        data: { id: node.id },
        success: async response => {
          this.$emit('refetch')
          this.$toasted.success(this.$i18n.t('nodes.NODE_VERIFY_SUCCESS', { node: node.friendly_name }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
      })
    },
    editGroup () {
      this.$router.push({ name: 'nodeGroupEdit', params: { id: this.selectedGroupInformation.id } })
    },
    removeGroup () {
      if (confirm(this.$i18n.t('nodes.DELETE_GROUP_CONFIRM_DIALOG'))) {
        nodeAPI.deleteGroup({
          data: { id: this.selectedGroupInformation.id },
          success: response => {
            this.fetchNodes()
            this.$toasted.show(this.$i18n.t('nodes.GROUP_DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
        })
      }
    },
    showAddNodeModal () {
      this.$emit('showAddNodeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $pad;
  padding-bottom: $pad;
  border-bottom: 1px solid $color-border;
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
</style>
