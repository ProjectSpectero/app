<template>
  <div class="container">
    <div v-if="engagements && engagements.length" class="list section padded">
      <v-client-table :data="engagements" :columns="columns" :options="options">
        <template slot="type" slot-scope="props">
          <template v-if="props.row.type === 'NODE'">
            <div>{{ $i18n.t('misc.NODE') }} #{{ props.row.resource }}</div>
          </template>
          <template v-else-if="props.row.type === 'NODE_GROUP'">
            <div>{{ $i18n.t('misc.NODE_GROUP') }} #{{ props.row.resource }}</div>
          </template>
        </template>

        <template slot="actions" slot-scope="props">
          <button v-if="props.row.status === 'ACTIVE'" class="button" @click.stop="deleteEngagement(props.row.id)">
            {{ $i18n.t('misc.CANCEL') }}
          </button>
          <div v-else>&nbsp;</div>
        </template>
      </v-client-table>
    </div>
    <not-found v-else :msg="$i18n.t('misc.NOT_FOUND', { type: 'engagements' })"></not-found>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
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
      texts: {
        count: 'Showing {from} to {to} of {count} engagements|{count} engagements|One engagement',
        filter: '',
        filterPlaceholder: 'Search engagements',
        limit: 'Items:',
        page: 'Page:',
        noResults: 'No matching engagements',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
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
    deleteEngagement (id) {
      if (confirm(this.$i18n.t('nodes.DELETE_ENGAGEMENT_CONFIRM_DIALOG'))) {
        nodeAPI.deleteEngagement({
          data: {
            id: id
          },
          success: response => {
            this.$emit('updateEngagements')
            this.$toasted.success(this.$i18n.t('nodes.ENGAGEMENT_DELETE_SUCCESS'))
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
