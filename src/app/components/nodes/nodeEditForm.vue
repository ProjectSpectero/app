<template>
  <div class="col-6">
    <template v-if="!error">
      <div v-if="!loading">
        <form @submit.prevent.stop="submit">
          <div class="section padded">
            <h2>{{ $t('misc.GENERAL_INFO') }}</h2>
            <div
              v-if="formError"
              class="message message-error">{{ formError }}</div>

            <form-errors :form-errors="formErrors" />

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
                      <template v-if="field.labelKey">{{ object[field.labelKey] }}</template>
                      <template v-else-if="field.objectKey">{{ object[field.objectKey] }}</template>
                      <template v-else>{{ object }}</template>
                    </option>
                  </select>
                </div>
              </template>
              <template v-else-if="field.type === 'model'">
                <div
                  v-if="marketModels"
                  class="form-input">
                  <div class="label"><label :for="form.market_model">{{ $t('misc.MARKET_MODEL') }}</label></div>
                  <div class="input-with-tooltip">
                    <select v-model="form.market_model">
                      <option
                        v-for="model in marketModels"
                        :key="model"
                        :value="model">
                        {{ $t(`nodes.MODEL.${model}`) }}
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
              v-if="formFields"
              :class="{ 'button-loading': formLoading }"
              :disabled="formLoading"
              type="submit"
              class="button-info button-md max-width">
              {{ formLoading ? $t('misc.LOADING') : $t('misc.SAVE') }}
            </button>
          </div>
        </form>
      </div>
      <loading
        v-else
        text="Loading node information ..."/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'
import tooltip from '@/shared/components/tooltip'
import formErrors from '@/shared/components/formErrors'

export default {
  components: {
    loading,
    error,
    formErrors,
    tooltip
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      errorCode: 400,
      errorItem: 'groups',
      groups: null,
      formError: null,
      formErrors: [],
      formLoading: false,
      form: {},
      protocols: ['http'],
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      rules: {
        friendly_name: {
          max: 32
        },
        price: {
          required: true,
          // numeric: true, // Comment out to fix $ input library adding 'USD $' to input
          min_value: 5,
          max_value: 9999
        },
        protocols: {
          required: true,
          in: this.protocols
        },
        market_model: {
          required: true,
          in: this.marketModels
        },
        access_token: {
          max: 255,
          regex: /\s*:\s*/
        },
        port: {
          required: true,
          min_value: 1024,
          max_value: 65535
        },
        ip: {
          required: true,
          regex: /^(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
        }
      }
    }
  },
  computed: {
    formattedGroupList () {
      let groups = []

      // Add a "fake" uncategorized option
      groups.push({
        id: 0,
        label: this.$t('nodes.UNCATEGORIZED')
      })

      for (let index in this.groups) {
        let group = this.groups[index]
        groups.push({
          id: group.id,
          label: group.friendly_name
        })
      }

      if (this.form.group_id === null) {
        this.$set(this.form, 'group_id', 0)
      }

      return groups
    },
    formFields () {
      return [
        {
          name: 'friendly_name',
          label: this.$t('misc.FRIENDLY_NAME'),
          placeholder: this.$t('misc.FRIENDLY_NAME'),
          type: 'text'
        },
        {
          name: 'ip',
          label: this.$t('misc.IP'),
          placeholder: this.$t('misc.IP'),
          type: 'text'
        },
        {
          name: 'port',
          label: this.$t('misc.PORT_NUMBER'),
          placeholder: this.$t('misc.PORT_NUMBER'),
          type: 'number'
        },
        {
          name: 'access_token',
          label: this.$t('misc.ACCESS_TOKEN'),
          placeholder: this.$t('misc.PLACEHOLDER_ACCESS_TOKEN'),
          type: 'text'
        },
        {
          name: 'protocol',
          label: this.$t('misc.PROTOCOL'),
          placeholder: this.$t('misc.PROTOCOL'),
          type: 'select',
          object: this.protocols,
          objectKey: null
        },
        {
          name: 'market_model',
          label: this.$t('misc.MARKET_MODEL'),
          placeholder: this.$t('misc.MARKET_MODEL'),
          type: 'model',
          object: this.marketModels,
          objectKey: null
        },
        {
          name: 'price',
          label: this.$t('misc.PRICE'),
          placeholder: this.$t('misc.PRICE'),
          type: 'price',
          show: this.form.market_model !== 'UNLISTED'
        },
        {
          name: 'group_id',
          label: this.$t('misc.NODE_GROUP'),
          type: 'select',
          object: this.formattedGroupList,
          objectKey: 'id',
          labelKey: 'label'
        }
      ]
    }
  },
  async created () {
    this.form = Object.assign({}, this.node)
    await this.fetchGroups()
  },
  methods: {
    submit () {
      this.$validator.validateAll().then(result => {
        if (!result) {
          this.formError = this.$t(`errors.VALIDATION_FAILED`)
        } else {
          this.formError = null
          this.processSubmit()
        }
      })
    },
    async processSubmit () {
      this.formLoading = true

      await nodeAPI.edit({
        data: this.form,
        success: async response => {
          if (response.data.result) {
            this.formLoading = false
            this.formErrors = []
            this.$toasted.success(this.$t('nodes.UPDATE_SUCCESS'))

            // Updating the group requires a different API call
            if (this.node.group_id !== this.form.group_id) {
              await this.updateGroup(this.form.group_id)
            }
          }
        },
        fail: error => {
          if (error.fields) {
            Object.keys(error.fields).forEach(k => {
              if (Object.keys(error.fields[k])[0] !== undefined) {
                this.formErrors.push({
                  key: k,
                  text: this.$t('errors.' + Object.keys(error.fields[k])[0])
                })
              }
            })
          } else {
            this.$toasted.error(this.errorAPI(error, 'nodes'))
          }

          this.formLoading = false
        }
      })
    },
    async updateGroup (id) {
      this.formLoading = true

      await nodeAPI.updateGroupFromNode({
        data: {
          node_id: this.form.id,
          group_id: id
        },
        success: response => {
          if (response.data.result) {
            this.formLoading = false
            this.$toasted.success(this.$t('nodes.GROUP_FROM_NODE_UPDATE_SUCCESS'))
          }
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'nodes'))
          this.formLoading = false
        }
      })
    },
    async fetchGroups () {
      await nodeAPI.groups({
        success: response => {
          this.groups = response.data.result
          this.error = false
          this.loading = false
        },
        fail: e => {
          this.error = true
          this.errorCode = 400
        }
      })
    }
  }
}
</script>
