<template>
  <div>
    <div v-if="engagements && engagements.length" class="list pad-margin">
      <v-client-table :data="engagements" :columns="columns" :options="options">
        <template slot="type" slot-scope="props">
          <template v-if="props.row.type === 'NODE'">
            <div>{{ $i18n.t('misc.NODE') }} #{{ props.row.resource }}</div>
            <small>
              <router-link :to="{ name: 'node', params: { id: props.row.resource, type: 'view' } }">
                {{ $i18n.t('nodes.GO_TO_NODE') }}
              </router-link>
            </small>
          </template>
          <template v-else-if="props.row.type === 'NODE_GROUP'">
            <div>{{ $i18n.t('misc.NODE_GROUP') }} #{{ props.row.resource }}</div>
            <small>
              <router-link :to="{ name: 'groupEdit', params: { id: props.row.resource, type: 'view' } }">
                {{ $i18n.t('nodes.GO_TO_NODE_GROUP') }}
              </router-link>
            </small>
          </template>
        </template>

        <template slot="actions" slot-scope="props">
          <button v-if="props.row.status === 'ACTIVE'" class="button" @click.stop="removeEngagement(props.row.id)">
            {{ $i18n.t('misc.CANCEL') }}
          </button>
        </template>
      </v-client-table>
    </div>
    <not-found v-else :msg="$i18n.t('misc.NOT_FOUND', { type: 'engagements' })"></not-found>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node.js'
import notFound from '@/shared/components/notFound'

export default {
  props: {
    engagements: Array
  },
  data () {
    return {
      columns: ['type', 'amount', 'quantity', 'status', 'sync_status', 'actions'],
      sortableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      filterableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      options: {}
    }
  },
  created () {
    this.options = {
      skin: '',
      columnsClasses: {
        actions: 'table-actions'
      },
      perPage: 10,
      pagination: true,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
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
