<template>
  <div v-if="nodes">
    <header v-if="!hideHeader && selectedGroupInformation" class="nodes-title">
      <div class="content">
        <h2 class="mb-0">
          {{ selectedGroupInformation.friendly_name }}
          ({{ nodes.length }} nodes)
        </h2>
      </div>
      <div
        v-if="selectedGroupInformation.id !== 0"
        class="actions">
        <button
          class="button is-small is-danger"
          @click.stop="removeGroup">
          <span class="icon-trash-2"/>
        </button>

        <button
          class="button is-small"
          @click.stop="editGroup">
          {{ $t('nodes.EDIT_GROUP') }}
        </button>
      </div>
    </header>
    <div
      v-if="nodes.length > 0"
      class="columns is-multiline">
      <div
        v-for="row in nodes"
        :key="row.id"
        class="column is-half">
        <article class="node">
          <header>
            <div class="level">
              <div class="level-left node-title">
                <h2 class="title is-4">{{ row.friendly_name ? row.friendly_name : row.id }}</h2>
                <h3 class="subtitle is-6">{{ row.ip }}</h3>
              </div>
              <div class="level-right">
                <b-tooltip
                  :label="$t(`nodes.STATUS_TOOLTIPS.${row.status}`)"
                  position="is-top">
                  <span
                    class="tag"
                    :class="'badge-' + row.status.toLowerCase()">
                    {{ $t(`nodes.STATUS.${row.status}`) }}
                  </span>
                </b-tooltip>
              </div>
            </div>
          </header>
          <div class="actions buttons mt-2">
            <button
              v-if="row.status === 'UNCONFIRMED' && row.status !== 'PENDING_VERIFICATION'"
              class="button is-success"
              @click.stop="verifyNode($event, row)">
              {{ $t('misc.VERIFY') }}
            </button>
            <b-dropdown>
              <button class="button" slot="trigger">
                  <span>Manage</span>
                  <b-icon icon="sort-down" size="is-small"/>
              </button>
              <template v-if="row.status === 'CONFIRMED'">
                <b-dropdown-item has-link>
                  <router-link :to="{ name: 'daemon', params: { nodeId: row.id } }">
                    <b-icon icon="wrench" size="is-small"/>
                    <span>Remote Management</span>
                  </router-link>
                </b-dropdown-item>
                <hr class="navbar-divider">
              </template>
              <b-dropdown-item has-link>
                <router-link :to="{ name: 'node', params: { action: 'edit', id: row.id } }">
                  <b-icon icon="pencil-alt" size="is-small"/>
                  <span>Edit</span>
                </router-link>
              </b-dropdown-item>
              <b-dropdown-item
                class="has-text-danger"
                @click.stop="removeNode(row.id)">
                  <b-icon icon="trash-alt" size="is-small"/>
                  <span>Delete</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </article>
      </div>
    </div>
    <div
      v-else
      class="alert-msg-centered">
      <div class="icon-slash big-icon"/>
      <h1>{{ $t('nodes.NO_NODES_TITLE') }}</h1>
      <p>{{ $t( (groups && groups.length) ? 'nodes.NO_NODES_TEXT' : 'nodes.NO_NODES_TEXT_ACCOUNT') }}</p>
      <button
        class="button is-success"
        @click.prevent="showAddNodeModal()">
        <span class="icon-plus"/>{{ $t('nodes.ADD_NODE') }}
      </button>
    </div>

    <!-- <div
      v-if="nodes.length > 0"
      class="datatable">
      <table>
        <table-header
          :columns="columns"
          :headings="headings"
          :sortable="sortable"
          @sortByColumn="sortByColumn"/>
        <tbody>
          <tr
            v-for="row in nodes"
            :key="row.id">
            <td>
              <div>
                {{ row.friendly_name ? row.friendly_name : row.id }}
              </div>
              <div class="ip">{{ row.ip }}</div>
            </td>
            <td>
              <div class="service-badges">
                <article
                  v-tooltip="service.type"
                  v-for="service in row.services"
                  :key="service.id"
                  :class="`type-${service.type.toLowerCase()}`"/>
              </div>
            </td>
            <td>{{ $t(`nodes.MODEL.${row.market_model}`) }}</td>
            <td>
              <div
                v-tooltip="{ html: `node-${row.id}-status-tooltip` }"
                :class="'badge-' + row.status.toLowerCase()">
                {{ $t(`nodes.STATUS.${row.status}`) }}
              </div>
              <div
                :id="`node-${row.id}-status-tooltip`"
                class="tooltip"
                v-html="$t(`nodes.STATUS_TOOLTIPS.${row.status}`)"/>
            </td>
            <td class="table-actions">
              <button
                v-if="row.status === 'UNCONFIRMED' && row.status !== 'PENDING_VERIFICATION'"
                class="button is-success"
                @click.stop="verifyNode($event, row)">
                <span class="icon-check"/> {{ $t('misc.VERIFY') }}
              </button>

              <router-link
                v-if="row.status === 'CONFIRMED'"
                :to="{ name: 'daemon', params: { nodeId: row.id } }"
                class="button is-info">
                <span class="icon-sliders"/> Manage
              </router-link>

              <button
                class="button"
                @click.stop="removeNode(row.id)">
                <span class="icon-trash-2"/>
              </button>

              <router-link
                :to="{ name: 'node', params: { action: 'edit', id: row.id } }"
                class="button">
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
      <h1>{{ $t('nodes.NO_NODES_TITLE') }}</h1>
      <p>{{ $t( (groups && groups.length) ? 'nodes.NO_NODES_TEXT' : 'nodes.NO_NODES_TEXT_ACCOUNT') }}</p>
      <button
        class="button is-success"
        @click.prevent="showAddNodeModal()">
        <span class="icon-plus"/>{{ $t('nodes.ADD_NODE') }}
      </button>
    </div> -->

    <paginator
      v-if="nodes.length > 0"
      :pagination="pagination"
      @changedPage="changedPage"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
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
    pagination: {
      type: Object,
      required: false,
      default: () => {}
    },
    nodes: {
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
    },
    groups: {
      type: Array,
      required: false,
      default: () => []
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
  methods: {
    sortByColumn () {
      this.$emit('sortByColumn')
    },
    changedPage (page) {
      this.$emit('changedPage', page)
    },
    async removeNode (id) {
      if (confirm(this.$t('misc.DELETE_CONFIRM_DIALOG', { object: 'node' }))) {
        await nodeAPI.delete({
          data: {
            id: id
          },
          success: response => {
            this.$emit('refetch')
            this.$toasted.success(this.$t('nodes.DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes')),
          overrideErrors: true
        })
      }
    },
    verifyNode ($event, node) {
      let button = $event.currentTarget
      button.disabled = true
      button.classList.toggle('is-loading')
      button.classList.toggle('button is-success')

      nodeAPI.verify({
        data: {
          id: node.id
        },
        success: async response => {
          this.$emit('refetch')
          this.$toasted.success(this.$t('nodes.NODE_VERIFY_SUCCESS', { node: node.friendly_name ? node.friendly_name : node.id }))
          button.remove()
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'nodes'))
          button.disabled = false
          button.classList.toggle('is-loading')
          button.classList.toggle('button is-success')
        },
        overrideErrors: true
      })
    },
    editGroup () {
      this.$router.push({ name: 'nodeGroupEdit', params: { id: this.selectedGroupInformation.id } })
    },
    removeGroup () {
      if (confirm(this.$t('nodes.DELETE_GROUP_CONFIRM_DIALOG'))) {
        nodeAPI.deleteGroup({
          data: { id: this.selectedGroupInformation.id },
          success: response => {
            this.$route.params.id = null
            this.$route.params.page = null
            this.$emit('refetch')
            this.$toasted.success(this.$t('nodes.GROUP_DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes')),
          overrideErrors: true
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
.nodes-title {
  display: flex;
  justify-content: space-between;

  h2 {
    flex: 1;
  }
}
.node {
  padding: $pad;
  border: 1px solid #eee;
  border-radius: 5px;

  .node-title {
    display: block;
  }
}
</style>
