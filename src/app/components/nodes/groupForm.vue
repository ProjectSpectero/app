<template>
  <form @submit.prevent.stop="submit">
    <div class="col-6 section padded">
      <div class="col">
        <h2>{{ $i18n.t('misc.GENERAL_INFO') }}</h2>
        <div
          v-if="formError"
          class="message message-error">{{ formError }}</div>

        <div>
          <div class="form-input">
            <div class="label">
              <label for="friendly_name">{{ $i18n.t('misc.FRIENDLY_NAME') }}</label>
            </div>
            <input
              v-validate="rules.friendly_name"
              id="friendly_name"
              v-model="form.friendly_name"
              :class="{'input-error': errors.has('friendly_name')}"
              :disabled="formLoading"
              type="text"
              name="friendly_name"
              placeholder="Please add a name for this node group"
              class="input max-width"
              data-vv-as="friendly_name">

            <span
              v-show="errors.has('friendly_name')"
              class="input-error-message">
              {{ errors.first('friendly_name') }}
            </span>
          </div>

          <div
            v-if="marketModels"
            class="form-input">
            <div class="label">
              <label for="price">{{ $i18n.t('misc.PRICE') }}</label>
            </div>
            <input
              v-validate="rules.price"
              id="price"
              v-model="form.price"
              :class="{'input-error': errors.has('price')}"
              :disabled="formLoading"
              type="number"
              name="price"
              placeholder="Price"
              class="input max-width"
              data-vv-as="price">
            <p
              class="input-note"
              v-html="$i18n.t('nodes.GROUP_PRICE_AVAILABILITY', { model1: marketModels[1], model2: marketModels[2] })"/>

            <span
              v-show="errors.has('price')"
              class="input-error-message">
              {{ errors.first('price') }}
            </span>
          </div>

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
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import nodeAPI from '@/app/api/node'
import tooltip from '@/shared/components/tooltip'

export default {
  components: {
    tooltip
  },
  props: {
    group: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {
      formError: null,
      formFields: null,
      formLoading: false,
      form: null,
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ],
      rules: {
        friendly_name: {
          max: 50
        },
        price: {
          required: true,
          min_value: 5
        },
        market_model: {
          required: true,
          in: this.marketModels
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
  },
  created () {
    // Populate form object
    this.form = this.group ? Object.assign({}, this.group) : {}
    this.form.status = 'ACTIVE'

    this.formFields = [
      { name: 'friendly_name', label: 'Friendly name', placeholder: 'Name for this node', type: 'text' },
      { name: 'market_model', label: 'Market Model', placeholder: 'Market Model', type: 'select', object: this.marketModels, objectKey: null },
      { name: 'price', label: 'Friendly name', placeholder: 'Price', type: 'number' }
    ]
  },
  methods: {
    async submit () {
      this.formLoading = true

      // Editing or creating?
      if (this.group) {
        await nodeAPI.editGroup({
          data: this.form,
          success: response => {
            this.formLoading = false
            this.$toasted.success(this.$i18n.t('nodes.GROUP_UPDATE_SUCCESS'))
          },
          fail: error => {
            this.formLoading = false
            this.$toasted.error(this.errorAPI(error, 'nodes'))
          }
        })
      } else {
        await nodeAPI.createGroup({
          data: this.form,
          success: response => {
            this.$router.push({ name: 'nodesByGroup', params: { id: response.data.result.id, page: 1 } })
            this.$toasted.success(this.$i18n.t('nodes.GROUP_CREATE_SUCCESS'))
          },
          fail: error => {
            this.formLoading = false
            this.$toasted.error(this.errorAPI(error, 'errors'))
          }
        })
      }
    }
  }
}
</script>
