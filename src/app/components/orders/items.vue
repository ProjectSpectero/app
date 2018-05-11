<template>
  <v-client-table :data="items" :columns="columns" :options="options">
    <template slot="description" slot-scope="props">
      <template v-if="props.row.type === 'NODE'">
        <div>{{ $i18n.t('misc.NODE') }} #{{ props.row.resource }}</div>
        <small>
          <router-link :to="{ name: 'marketView', params: { id: props.row.resource, type: 'node' } }">
            {{ $i18n.t('nodes.GO_TO_NODE') }}
          </router-link>
        </small>
      </template>
      <template v-else-if="props.row.type === 'NODE_GROUP' || props.row.type === 'MANAGED'">
        <div>{{ $i18n.t('misc.NODE_GROUP') }} #{{ props.row.resource }}</div>
        <small>
          <router-link :to="{ name: 'marketView', params: { id: props.row.resource, type: 'group' } }">
            {{ $i18n.t('nodes.GO_TO_NODE_GROUP') }}
          </router-link>
        </small>
      </template>
    </template>

    <template slot="amount" slot-scope="props">
      {{ props.row.amount | currency }}
    </template>

    <template slot="sync_status" slot-scope="props">
      {{ $i18n.t('orders.SYNC_STATUS.' + props.row.sync_status) }}
    </template>

    <template slot="total" slot-scope="props">
      {{ props.row.amount * props.row.quantity | currency }}
    </template>

    <template slot="actions" slot-scope="props">
      <button v-if="props.row.status === 'ACTIVE'" class="button" @click.stop="deleteEngagement(props.row.id)">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
      <div v-else>-</div>
    </template>
  </v-client-table>
</template>

<script>
import nodeAPI from '@/app/api/node'

export default {
  props: {
    items: Array
  },
  data () {
    return {
      columns: ['description', 'type', 'resource', 'status', 'sync_status', 'quantity', 'amount', 'total', 'actions'],
      headings: {
        description: 'Item',
        type: 'Type',
        amount: 'Price',
        quantity: 'Quantity',
        resource: 'Resource',
        status: 'Status',
        sync_status: 'Sync Status',
        total: 'Amount'
      },
      options: {}
    }
  },
  created () {
    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} items|{count} items|One item',
        filter: '',
        filterPlaceholder: 'Search items',
        limit: 'Items:',
        page: 'Page:',
        noResults: 'No matching items',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      perPage: 50,
      headings: this.headings,
      sortable: this.columns,
      filterable: false
    }
  },
  methods: {
    deleteEngagement (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_ENGAGEMENT_CONFIRM_DIALOG'))) {
        nodeAPI.deleteEngagement({
          data: { id: id },
          success: response => {
            this.$emit('updateEngagements')
            this.$toasted.success(this.$i18n.t('nodes.ENGAGEMENT_DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
        })
      }
    }
  }
}
</script>
