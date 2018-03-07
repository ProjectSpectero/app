<template>
  <form @submit.prevent.stop="submit">
    <div class="container">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <h2>General Information</h2>

      <div v-for="field in formFields" :key="field.name">
        <template v-if="field.type === 'select'">
          <div class="form-input" v-if="field.object">
            <div class="label"><label :for="field.name">Node Group</label></div>
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
              :disabled="formDisable"
              v-validate="rules[field.name]"
              :data-vv-as="field.name">

            <span v-show="errors.has(field.name)" class="input-error-message">
              {{ errors.first(field.name) }}
            </span>
          </div>
        </template>
      </div>
    </div>

    <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
      {{ formDisable ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
    </button>
  </form>
</template>

<script>
import nodeAPI from '@/api/node.js'

// Node group should be sent separately (See 'Assign Node To Group')

export default {
  props: {
    node: Object
  },
  data () {
    return {
      groups: null,
      formError: null,
      formDisable: false,
      form: null,
      loading: true,
      protocols: [
        'http',
        'https'
      ],
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
    this.form = JSON.parse(JSON.stringify(this.node))
    await this.fetchGroups()

    this.formFields = [
      { name: 'friendly_name', label: 'Friendly name', placeholder: 'Name for this node', type: 'text' },
      { name: 'ip', label: 'IP Address', placeholder: 'IP Address', type: 'text' },
      { name: 'city', label: 'City', placeholder: 'City', type: 'text' },
      { name: 'access_token', label: 'Access Token', placeholder: 'Add a new access token in the format username:password to update', type: 'text' },
      { name: 'protocol', label: 'Protocol', placeholder: 'Protocol', type: 'select', object: this.protocols, objectKey: null },
      { name: 'price', label: 'Friendly name', placeholder: 'Price', type: 'number' },
      { name: 'group_id', label: 'Node Group', type: 'select', object: this.groups, objectKey: 'id' }
    ]
  },
  methods: {
    async submit () {
      this.formDisable = true

      await nodeAPI.edit({
        data: this.form,
        success: response => {
          if (response.data.result) {
            this.formDisable = false
            this.$toasted.success(this.$i18n.t('nodes.UPDATE_SUCCESS'))
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    async fetchGroups () {
      await nodeAPI.groups({
        success: response => {
          if (response.data.result) {
            this.groups = response.data.result
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    }
  }
}

</script>

<style>

</style>
