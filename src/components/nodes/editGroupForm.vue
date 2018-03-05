<template>
  <form @submit.prevent.stop="submit">
    <div class="container">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <h2>General Information</h2>

      <div class="form-input">
        <div class="label"><label for="friendly_name">Friendly Name</label></div>
        <input
          type="text"
          v-model="form.friendly_name"
          name="friendly_name"
          id="friendly_name"
          placeholder="Please add a name for this node group"
          class="input max-width"
          :class="{'input-error': errors.has('friendly_name')}"
          :disabled="formDisable"
          v-validate="rules['friendly_name']"
          data-vv-as="friendly_name">

        <span v-show="errors.has('friendly_name')" class="input-error-message">
          {{ errors.first('friendly_name') }}
        </span>
      </div>
    </div>

    <button type="submit" class="button button-info button-md max-width" :disabled="formDisable">
      {{ formDisable ? $i18n.t('misc.LOADING') : $i18n.t('misc.SAVE') }}
    </button>
  </form>
</template>

<script>
import nodeAPI from '@/api/node.js'

export default {
  props: {
    group: Object
  },
  data () {
    return {
      formError: null,
      formDisable: false,
      form: null,
      loading: true,
      rules: {
        friendly_name: {
          max: 50
        }
      }
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.group))
  },
  methods: {
    async submit () {
      this.formDisable = true

      await nodeAPI.editGroup({
        data: this.form,
        success: response => {
          if (response.data.result) {
            this.formDisable = false
            this.$toasted.success(this.$i18n.t('nodes.GROUP_UPDATE_SUCCESS'))
          } else {
            this.error404()
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
