<template>
  <div class="datatable">
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

    <paginator v-if="serverPagination" :pagination="pagination" @changedPage="changedPage"></paginator>
  </div>
</template>

<script>
import nodeAPI from '@/api/node.js'
import paginator from '@/components/common/paginator'

export default {
  props: {
    pagination: {
      type: Object,
      required: false
    },
    serverPagination: {
      type: Boolean,
      default: false
    },
    nodes: Array,
    columns: Array,
    options: Object
  },
  methods: {
    changedPage (page) {
      this.$emit('changedPage', page)
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
    }
  },
  components: {
    paginator
  }
}
</script>

<style lang="scss" scoped>
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
</style>
