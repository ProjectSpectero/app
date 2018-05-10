<template>
  <div>
    <template v-if="!error">
      <div v-if="!loading">
        <form @submit.prevent.stop="submit">
          <div class="container">
            <div class="col-container col-2">
              <div class="col">
                <h2>{{ $i18n.t('misc.GENERAL_INFO') }}</h2>
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
                <button v-if="formFields" type="submit" class="button button-info button-md max-width" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
                  {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
                </button>
              </div>
              <div class="col"></div>
            </div>
          </div>
        </form>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'

export default {
  props: {
    node: Object
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
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      formFields: null,
      rules: {
        friendly_name: {
          max: 50
        },
        city: {
          max: 255
        },
        protocols: {
          in: this.protocols
        },
        market_model: {
          in: this.marketModels
        },
        access_token: {
          max: 255,
          regex: /\s*:\s*/
        },
        port: {
          min_value: 1024,
          max_value: 65535
        },
        ip: {
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
      { name: 'city', label: this.$i18n.t('misc.CITY'), placeholder: this.$i18n.t('misc.CITY'), type: 'text' },
      { name: 'access_token', label: this.$i18n.t('misc.ACCESS_TOKEN'), placeholder: this.$i18n.t('misc.PLACEHOLDER_ACCESS_TOKEN'), type: 'text' },
      { name: 'protocol', label: this.$i18n.t('misc.PROTOCOL'), placeholder: this.$i18n.t('misc.PROTOCOL'), type: 'select', object: this.protocols, objectKey: null },
      { name: 'market_model', label: this.$i18n.t('misc.MARKET_MODEL'), placeholder: this.$i18n.t('misc.MARKET_MODEL'), type: 'select', object: this.marketModels, objectKey: null },
      { name: 'price', label: this.$i18n.t('misc.PRICE'), placeholder: this.$i18n.t('misc.PRICE'), type: 'number' },
      { name: 'group_id', label: this.$i18n.t('misc.NODE_GROUP'), type: 'select', object: this.groups, objectKey: 'id' }
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
  },
  components: {
    loading,
    error
  }
}
</script>
