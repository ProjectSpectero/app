<template>
  <form @submit.prevent.stop="submit">
    <div class="col-6 section padded">
      <div class="col">
        <div
          v-if="formError"
          class="message message-error">{{ formError }}</div>

        <div>
          <div class="form-input">
            <div class="label">
              <label for="friendly_name">{{ $t('misc.FRIENDLY_NAME') }}</label>
            </div>

            <input
              v-validate="rules.friendly_name"
              id="friendly_name"
              v-model="form.friendly_name"
              :class="{'input-error': errors.has('friendly_name')}"
              :disabled="formLoading"
              type="text"
              name="friendly_name"
              placeholder="Name this node group"
              class="input max-width"
              data-vv-as="friendly name">

            <span
              v-show="errors.has('friendly_name')"
              class="input-error-message"
              v-html="errors.first('friendly_name')"/>
          </div>
          <div
            v-if="form.market_model !== 'UNLISTED'"
            class="form-input">
            <div class="label">
              <label for="price">{{ $t('misc.PRICE') }}</label>
            </div>

            <vue-numeric
              v-validate="rules.price"
              id="price"
              v-model="form.price"
              :class="{'input-error': errors.has('price')}"
              :disabled="formLoading"
              :min="0"
              :precision="2"
              :empty-value="0"
              name="price"
              type="price"
              class="input max-width"
              currency="USD $"
              separator=","
              output-type="Number"
              data-vv-as="price" />

            <span
              v-show="errors.has('price')"
              class="input-error-message"
              v-html="errors.first('price')"/>
          </div>

          <div class="form-input">
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
        </div>
        <button
          v-if="formFields"
          :class="{ 'button-loading': formLoading }"
          :disabled="formLoading"
          type="submit"
          class="button-info button-md max-width">
          {{ formLoading ? $t('misc.LOADING') : $t('misc.SAVE_GROUP') }}
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
      form: {},
      marketModels: [
        'UNLISTED',
        'LISTED_SHARED',
        'LISTED_DEDICATED'
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'appAuth/user'
    }),
    rules () {
      return {
        friendly_name: {
          required: true,
          max: 32
        },
        price: {
          required: true,
          // numeric: true, // Comment out to fix $ input library adding 'USD $' to input
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
  created () {
    // Populate form object
    this.form = this.group ? Object.assign({}, this.group) : {}

    // Set default market model if none set
    if (!this.form.market_model) {
      this.$set(this.form, 'market_model', this.marketModels[0])
    }

    this.formFields = [
      { name: 'friendly_name', label: 'Friendly name', placeholder: 'Name for this node', type: 'text' },
      { name: 'market_model', label: 'Market Model', placeholder: 'Market Model', type: 'select', object: this.marketModels, objectKey: null },
      { name: 'price', label: 'Friendly name', placeholder: 'Price', type: 'number' }
    ]
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

      // Editing or creating?
      if (this.group) {
        await nodeAPI.editGroup({
          data: this.form,
          success: response => {
            this.formLoading = false
            this.$toasted.success(this.$t('nodes.GROUP_UPDATE_SUCCESS'))
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
            this.$toasted.success(this.$t('nodes.GROUP_CREATE_SUCCESS'))
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
