<template>
  <div>
    <div class="section padded col-6">
      <form @submit.prevent.stop="submit">
        <h2>{{ $i18n.t('misc.MARKET_INFO') }}</h2>
        <div
          v-if="formError"
          class="message message-error">{{ formError }}</div>

        <div
          v-for="field in formFields"
          v-if="field.show !== false"
          :key="field.name">
          <template v-if="field.type === 'select'">
            <div
              v-if="field.object"
              class="form-input">
              <div class="label"><label :for="field.name">{{ field.label }}</label></div>
              <select v-model="form[field.name]">
                <option
                  v-for="object in field.object"
                  :key="object.id"
                  :value="field.objectKey ? object[field.objectKey] : object">
                  <span v-if="field.objectKey">{{ object[field.objectKey] }}</span>
                  <span v-else>{{ object }}</span>
                </option>
              </select>
            </div>
          </template>
          <template v-else-if="field.type === 'model'">
            <div
              v-if="marketModels"
              class="form-input">
              <div class="label"><label :for="form.market_model">{{ $i18n.t('misc.MARKET_MODEL') }}</label></div>
              <div class="input-with-tooltip">
                <select v-model="form.market_model">
                  <option
                    v-for="model in marketModels"
                    :key="model"
                    :value="model">
                    {{ $i18n.t(`nodes.MODEL.${model}`) }}
                  </option>
                </select>
                <tooltip id="nodes.topics.marketModels"/>
              </div>
            </div>
          </template>
          <template v-else-if="field.type === 'price'">
            <div class="form-input">
              <div class="label"><label :for="field.name">{{ field.label }}</label></div>

              <vue-numeric
                v-validate="rules[field.name]"
                v-model="form[field.name]"
                :type="field.type"
                :name="field.name"
                :id="field.name"
                :class="{'input-error': errors.has(field.name)}"
                :disabled="formLoading"
                :data-vv-as="field.name"
                :min="0"
                :precision="2"
                :empty-value="0"
                class="input max-width"
                currency="USD $"
                separator=","
                output-type="Number" />

              <span
                v-show="errors.has(field.name)"
                class="input-error-message">
                {{ errors.first(field.name) }}
              </span>
            </div>
          </template>
          <template v-else>
            <div class="form-input">
              <div class="label"><label :for="field.name">{{ field.label }}</label></div>
              <input
                v-validate="rules[field.name]"
                :type="field.type"
                v-model="form[field.name]"
                :name="field.name"
                :id="field.name"
                :placeholder="field.placeholder"
                :class="{'input-error': errors.has(field.name)}"
                :disabled="formLoading"
                :data-vv-as="field.name"
                class="input max-width">

              <span
                v-show="errors.has(field.name)"
                class="input-error-message">
                {{ errors.first(field.name) }}
              </span>
            </div>
          </template>
        </div>

        <button
          :class="{ 'button-loading': formLoading }"
          :disabled="formLoading"
          type="submit"
          class="button-info button-md max-width">
          {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
        </button>
      </form>
    </div>

    <div
      v-if="engagements && engagements.length"
      class="col-6 list section padded">
      <v-client-table
        :data="engagements"
        :columns="columns"
        :options="options">
        <template
          slot="status"
          slot-scope="props">
          <div :class="'badge-' + props.row.status.toLowerCase()">
            {{ $i18n.t(`nodes.STATUS.${props.row.status}`) }}
          </div>
        </template>

        <template
          slot="sync_status"
          slot-scope="props">
          <div :class="['sync-status-' + (props.row.sync_status === 'PENDING_SYNC' ? 'pending' : 'complete')]">
            <span v-if="props.row.sync_status === 'PENDING_SYNC'"><span class="icon-rotate-cw"/> Sync Pending</span>
            <span v-else><span class="icon-check-circle"/> In Sync</span>
          </div>
        </template>
        <template
          slot="type"
          slot-scope="props">
          <template v-if="props.row.type === 'NODE'">
            <div>{{ $i18n.t('misc.NODE') }} #{{ props.row.resource }}</div>
          </template>
          <template v-else-if="props.row.type === 'NODE_GROUP'">
            <div>{{ $i18n.t('misc.NODE_GROUP') }} #{{ props.row.resource }}</div>
          </template>
        </template>

        <template
          slot="actions"
          slot-scope="props">
          <button
            v-if="props.row.status === 'ACTIVE'"
            class="button"
            @click.stop="deleteEngagement(props.row.id)">
            {{ $i18n.t('misc.CANCEL') }}
          </button>
          <div v-else>&nbsp;</div>
        </template>
      </v-client-table>
    </div>
    <not-found
      v-else
      type="engagements"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import notFound from '@/shared/components/notFound'
import tooltip from '@/shared/components/tooltip'

export default {
  components: {
    notFound,
    tooltip
  },
  props: {
    engagements: {
      type: Array,
      required: true
    },
    node: {
      type: Object,
      required: false,
      default: () => {}
    },
    group: {
      type: Object,
      required: false,
      default: () => {}
    }
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
      form: {},
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      rules: {
        friendly_name: {
          required: true,
          max: 50
        },
        price: {
          required: true,
          numeric: true,
          min_value: 5,
          max_value: 9999
        },
        market_model: {
          required: true,
          in: this.marketModels
        }
      }
    }
  },
  computed: {
    formFields () {
      return [
        {
          name: 'friendly_name',
          label: this.$i18n.t('misc.FRIENDLY_NAME'),
          placeholder: this.$i18n.t('misc.FRIENDLY_NAME'),
          type: 'text'
        },
        {
          name: 'market_model',
          label: this.$i18n.t('misc.MARKET_MODEL'),
          placeholder: this.$i18n.t('misc.MARKET_MODEL'),
          type: 'model',
          object: this.marketModels,
          objectKey: null
        },
        {
          name: 'price',
          label: this.$i18n.t('misc.PRICE'),
          placeholder: this.$i18n.t('misc.PRICE'),
          type: 'price',
          show: this.form.market_model !== 'UNLISTED'
        }
      ]
    }
  },
  created () {
    let item = this.node ? this.node : this.group
    let fields = ['id', 'friendly_name', 'market_model', 'price', 'ip', 'port', 'protocol']

    for (let field in fields) {
      this.$set(this.form, fields[field], item[fields[field]])
    }

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
  },
  methods: {
    submit () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$i18n.t(`errors.VALIDATION_FAILED`)
        } else {
          this.formError = null
          this.processSubmit()
        }
      })
    },
    async processSubmit () {
      this.formLoading = true
      const method = this.node ? nodeAPI['edit'] : nodeAPI['editGroup']

      await method({
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
