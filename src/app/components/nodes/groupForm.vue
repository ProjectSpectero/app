<template>
  <form @submit.prevent.stop="submit">
    <div class="col-6 section padded">
      <div class="col">
        <h2>{{ $i18n.t('misc.GENERAL_INFO') }}</h2>
        <div class="message message-error" v-if="formError">{{ formError }}</div>

        <div>
          <div class="form-input">
            <div class="label">
              <label for="friendly_name">{{ $i18n.t('misc.FRIENDLY_NAME') }}</label>
            </div>
            <input
              type="text"
              v-model="form.friendly_name"
              name="friendly_name"
              id="friendly_name"
              placeholder="Please add a name for this node group"
              class="input max-width"
              :class="{'input-error': errors.has('friendly_name')}"
              :disabled="formLoading"
              v-validate="rules['friendly_name']"
              data-vv-as="friendly_name">

            <span v-show="errors.has('friendly_name')" class="input-error-message">
              {{ errors.first('friendly_name') }}
            </span>
          </div>

          <div class="form-input" v-if="marketModels">
            <div class="label">
              <label for="price">{{ $i18n.t('misc.PRICE') }}</label>
            </div>
            <input
              type="number"
              v-model="form.price"
              name="price"
              id="price"
              placeholder="Price"
              class="input max-width"
              :class="{'input-error': errors.has('price')}"
              :disabled="formLoading"
              v-validate="rules['price']"
              data-vv-as="price">
              <p class="input-note" v-html="$i18n.t('nodes.GROUP_PRICE_AVAILABILITY', { model1: marketModels[1], model2: marketModels[2] })"></p>

            <span v-show="errors.has('price')" class="input-error-message">
              {{ errors.first('price') }}
            </span>
          </div>

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
        </div>
        <button v-if="formFields" type="submit" class="button-info button-md max-width" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
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
  props: {
    group: {
      required: false,
      type: Object
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
        market_model: {
          in: this.marketModels
        }
      }
    }
  },
  created () {
    // Populate form object
    this.form = this.group ? Object.assign({}, this.group) : {}
    this.form.user_id = this.user.id
    this.form.status = 'ACTIVE'

    this.formFields = [
      { name: 'friendly_name', label: 'Friendly name', placeholder: 'Name for this node', type: 'text' },
      { name: 'market_model', label: 'Market Model', placeholder: 'Market Model', type: 'select', object: this.marketModels, objectKey: null },
      { name: 'price', label: 'Friendly name', placeholder: 'Price', type: 'number' }
    ]
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    })
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
  },
  components: {
    tooltip
  }
}
</script>
