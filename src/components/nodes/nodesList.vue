<template>
  <div class="datatable">
    <v-client-table :data="nodes" :columns="columns" :options="options">
      <template slot="name" slot-scope="props">
        <div>{{ props.row.friendly_name }}</div>
        <div class="ip">{{ props.row.ip }}</div>
      </template>

      <template slot="services" slot-scope="props">
        <div class="service-badges">
          <div v-for="service in props.row.services" :key="service.id">
            {{ service.type }}
          </div>
        </div>
      </template>

      <template slot="market_model" slot-scope="props">
        {{ $i18n.t(`nodes.MODEL.${props.row.market_model}`) }}
      </template>

      <template slot="status" slot-scope="props">
        <div :class="'badge status-' + props.row.status">
          {{ $i18n.t(`nodes.STATUS.${props.row.status.toUpperCase()}`) }}
        </div>
      </template>

      <template slot="actions" slot-scope="props">
        <button v-if="props.row.status === 'unconfirmed'" class="button button-sm" @click.stop="verifyNode(props.row)">
          {{ $i18n.t('misc.VERIFY') }}
        </button>

        <router-link class="button button-icon" :to="{ name: 'node', params: { action: 'view', id: props.row.id } }">
          <span class="icon-more-horizontal"></span>
        </router-link>

        <router-link class="button button-icon" :to="{ name: 'node', params: { action: 'edit', id: props.row.id } }">
          <span class="icon-edit-2"></span>
        </router-link>

        <button class="button button-icon" @click.stop="removeNode(props.row.id)">
          <span class="icon-trash-2"></span>
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
    }
  },
  components: {
    paginator
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

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
  &.status-confirmed {
    @extend .badge-success
  }
  &.status-unconfirmed {
    @extend .badge-error
  }
}
</style>
