<template>
  <div class="col-6">
    <template v-if="!error">
      <div v-if="!loading">
        <form @submit.prevent.stop="submit">
          <div class="section padded">
            <h2>{{ $i18n.t('misc.GENERAL_INFO') }}</h2>
            <div
              v-if="formError"
              class="message message-error">{{ formError }}</div>

            <div
              v-for="field in formFields"
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
                  <money
                    v-validate="rules[field.name]"
                    :type="field.type"
                    v-model="form[field.name]"
                    :name="field.name"
                    :id="field.name"
                    :placeholder="field.placeholder"
                    :class="{'input-error': errors.has(field.name)}"
                    :disabled="formLoading"
                    :data-vv-as="field.name"
                    class="input max-width" />

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
              {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
            </button>
          </div>
        </form>
      </div>
      <loading v-else/>
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

export default {
  components: {
    loading,
    error,
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
      totalGroups: null,
      processedGroups: 0,
      groupsPage: 1,
      formError: null,
      formLoading: false,
      form: null,
      protocols: ['http', 'https'],
      formFields: null,
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      rules: {
        friendly_name: {
          max: 50
        },
        city: {
          max: 255
        },
        price: {
          required: true,
          min_value: 5
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
  async created () {
    this.form = Object.assign({}, this.node)
    await this.fetchGroups()

    this.formFields = [
      { name: 'friendly_name', label: this.$i18n.t('misc.FRIENDLY_NAME'), placeholder: this.$i18n.t('misc.FRIENDLY_NAME'), type: 'text' },
      { name: 'ip', label: this.$i18n.t('misc.IP'), placeholder: this.$i18n.t('misc.IP'), type: 'text' },
      { name: 'port', label: this.$i18n.t('misc.PORT_NUMBER'), placeholder: this.$i18n.t('misc.PORT_NUMBER'), type: 'number' },
      { name: 'city', label: this.$i18n.t('misc.CITY'), placeholder: this.$i18n.t('misc.CITY'), type: 'text' },
      { name: 'access_token', label: this.$i18n.t('misc.ACCESS_TOKEN'), placeholder: this.$i18n.t('misc.PLACEHOLDER_ACCESS_TOKEN'), type: 'text' },
      { name: 'protocol', label: this.$i18n.t('misc.PROTOCOL'), placeholder: this.$i18n.t('misc.PROTOCOL'), type: 'select', object: this.protocols, objectKey: null },
      { name: 'market_model', label: this.$i18n.t('misc.MARKET_MODEL'), placeholder: this.$i18n.t('misc.MARKET_MODEL'), type: 'model', object: this.marketModels, objectKey: null },
      { name: 'price', label: this.$i18n.t('misc.PRICE'), placeholder: this.$i18n.t('misc.PRICE'), type: 'price' },
      { name: 'group_id', label: this.$i18n.t('misc.NODE_GROUP'), type: 'select', object: this.groups, objectKey: 'id' }
    ]
  },
  methods: {
    async submit () {
      this.formLoading = true

      await nodeAPI.edit({
        data: this.form,
        success: async response => {
          if (response.data.result) {
            this.formLoading = false
            this.$toasted.success(this.$i18n.t('nodes.UPDATE_SUCCESS'))

            // Updating the group requires a different API call
            if (this.node.group_id !== this.form.group_id) {
              await this.updateGroup(this.form.group_id)
            }
          }
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'nodes'))
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
            this.$toasted.success(this.$i18n.t('nodes.GROUP_FROM_NODE_UPDATE_SUCCESS'))
          }
        },
        fail: error => {
          this.$toasted.error(this.errorAPI(error, 'nodes'))
          this.formLoading = false
        }
      })
    },
    async fetchGroups () {
      // Group fetching is paged in chunks of 10, so we need to keep
      // fetching until we reach the total amount (received in pagination)
      while (this.totalGroups === null || this.totalGroups !== this.processedGroups) {
        await nodeAPI.groups({
          perPage: 10,
          groupsPage: this.groupsPage,
          success: response => {
            const pagination = response.data.pagination
            this.totalGroups = pagination.total
            this.processedGroups = this.processedGroups + response.data.result.length
            this.groupsPage++
            this.groups = this.groups ? [...this.groups, ...response.data.result] : response.data.result
            this.error = false
            this.loading = false
          },
          fail: e => {
            console.log(e)
            this.loading = false
            this.error = true
            this.totalGroups = 0
            this.processedGroups = 0
          }
        })
      }
    }
  }
}
</script>
