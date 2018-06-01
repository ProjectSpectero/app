<template>
  <div>
    <form class="container" @submit.prevent.stop="submit">
      <div class="section padded col-6 ml-0">
        <h2>{{ $i18n.t('misc.MARKET_INFO') }}</h2>
        <div class="message message-error" v-if="formError">{{ formError }}</div>

        <div v-for="field in formFields" :key="field.name">
          <template v-if="field.type === 'select'">
            <div class="form-input" v-if="field.object">
              <div class="label"><label :for="field.name">{{ field.label }}</label></div>
              <select v-model="form[field.name]">
                <option v-for="object in field.object" :key="object.id" :value="field.objectKey ? object[field.objectKey] : object">
                  <span v-if="field.objectKey">{{ object[field.objectKey] }}</span>
                  <span v-else>{{ object }}</span>
                </option>
              </select>
            </div>
          </template>
          <template v-else-if="field.type === 'model'">
            <div class="form-input" v-if="marketModels">
              <div class="label"><label :for="form.market_model">{{ $i18n.t('misc.MARKET_MODEL') }}</label></div>
              <div class="input-with-tooltip">
                <select v-model="form.market_model">
                  <option v-for="model in marketModels" :key="model" :value="model">
                    {{ $i18n.t(`nodes.MODEL.${model}`) }}
                  </option>
                </select>
                <tooltip id="nodes.topics.marketModels"></tooltip>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="form-input">
              <div class="label"><label :for="field.name">{{ field.label }}</label></div>
              <input
                :type="field.type"
                v-model="form[field.name]"
                :name="field.name"
                :id="field.name"
                :placeholder="field.placeholder"
                class="input max-width"
                :class="{'input-error': errors.has(field.name)}"
                :disabled="formLoading"
                v-validate="rules[field.name]"
                :data-vv-as="field.name">

              <span v-show="errors.has(field.name)" class="input-error-message">
                {{ errors.first(field.name) }}
              </span>
            </div>
          </template>
        </div>

        <button type="submit" class="button button-info button-md max-width" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
          {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
        </button>
      </div>
    </form>

    <div class="container">
      <div v-if="engagements && engagements.length" class="list section padded">
        <v-client-table :data="engagements" :columns="columns" :options="options">
          <template slot="status" slot-scope="props">
            <div :class="'badge status-' + props.row.status">
              {{ $i18n.t(`nodes.STATUS.${props.row.status}`) }}
            </div>
          </template>

          <template slot="sync_status" slot-scope="props">
            <div :class="['sync-status-' + (props.row.sync_status === 'PENDING_SYNC' ? 'pending' : 'complete')]">
              <span v-if="props.row.sync_status === 'PENDING_SYNC'"><span class="icon-rotate-cw"></span> Sync Pending</span>
              <span v-else><span class="icon-check-circle"></span> In Sync</span>
            </div>
          </template>
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
      <not-found v-else type="engagements"></not-found>
    </div>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import notFound from '@/shared/components/notFound'
import tooltip from '@/shared/components/tooltip'

export default {
  props: {
    engagements: Array,
    node: Object
  },
  data () {
    return {
      columns: ['type', 'amount', 'quantity', 'status', 'sync_status', 'actions'],
      sortableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      filterableColumns: ['type', 'amount', 'quantity', 'status', 'sync_status'],
      options: {},
      headings: {
        sync_status: 'Sync Status',
        actions: ''
      },
      formError: null,
      formLoading: false,
      formFields: [],
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      rules: {
        friendly_name: {
          max: 50
        },
        market_model: {
          in: this.marketModels
        }
      }
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
      headings: this.headings,
      sortable: this.sortableColumns,
      filterable: this.filterableColumns
    }

    this.form = Object.assign({}, this.node)

    this.formFields = [
      { name: 'friendly_name', label: this.$i18n.t('misc.FRIENDLY_NAME'), placeholder: this.$i18n.t('misc.FRIENDLY_NAME'), type: 'text' },
      { name: 'market_model', label: this.$i18n.t('misc.MARKET_MODEL'), placeholder: this.$i18n.t('misc.MARKET_MODEL'), type: 'model', object: this.marketModels, objectKey: null },
      { name: 'price', label: this.$i18n.t('misc.PRICE'), placeholder: this.$i18n.t('misc.PRICE'), type: 'number' }
    ]
  },
  methods: {
    async submit () {
      this.formLoading = true

      await nodeAPI.edit({
        data: this.form,
        success: response => {
          if (response.data.result) {
            this.formLoading = false
            this.$toasted.success(this.$i18n.t('nodes.UPDATE_SUCCESS'))
          }
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'nodes'))
          this.formLoading = false
        }
      })
    },
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
    notFound,
    tooltip
  }
}
</script>
