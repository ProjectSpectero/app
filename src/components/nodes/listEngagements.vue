<template>
  <div>
      <div v-if="engagements && engagements.length" class="list pad-margin">
        <v-client-table :data="engagements" :columns="columns" :options="options">
          <template slot="type" slot-scope="props">
            <template v-if="props.row.type === 'NODE'">
              <div>Node #{{ props.row.resource }}</div>
              <small>
                <router-link :to="{ name: 'node', params: { id: props.row.resource, type: 'view' }, hash: '#details' }">
                  Go to Node
                </router-link>
              </small>
            </template>
            <template v-else-if="props.row.type === 'NODE_GROUP'">
              <div>Node Group #{{ props.row.resource }}</div>
              <small>
                <router-link :to="{ name: 'group', params: { id: props.row.resource, type: 'view' }, hash: '#details' }">
                  Go to Node Group
                </router-link>
              </small>
            </template>
          </template>

          <template slot="actions" slot-scope="props">
            <button class="button" @click.stop="removeEngagement(props.row.id)">
              {{ $i18n.t('misc.CANCEL') }}
            </button>
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="engagements"></not-found>
  </div>
</template>

<script>
import nodeAPI from '@/api/node.js'
import notFound from '@/components/common/notFound'

export default {
  props: {
    engagements: Array
  },
  data () {
    return {
      columns: ['type', 'amount', 'quantity', 'status', 'sync_status', 'actions'],
      sortableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      filterableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      headings: {
        type: 'Type',
        status: 'Status',
        quantity: 'Quantity',
        amount: 'Amount',
        sync_status: 'Sync Status',
        actions: 'Actions'
      },
      options: {}
    }
  },
  methods: {
    removeEngagement (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_ENGAGEMENT_CONFIRM_DIALOG'))) {
        nodeAPI.deleteEngagement({
          data: {
            id: id
          },
          success: response => {
            this.$emit('updateEngagements')
            this.$toasted.show(this.$i18n.t('nodes.ENGAGEMENT_DELETE_SUCCESS'))
          },
          fail: error => this.$toasted.error(this.errorAPI(error, 'nodes'))
        })
      }
    }
  },
  components: {
    notFound
  }
}
</script>
