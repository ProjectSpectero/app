<template>
  <div>
    <form id="form-tfa">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="tfaValue"
          name="tfaValue"
          placeholder="Enter TFA Key"
          class="input max-width"
          :class="{'input-error': errors.has('tfaValue')}"
          :disabled="formLoading"
          v-validate="'required'"
          data-vv-as="two factor authentication key">

        <span v-show="errors.has('tfaValue')" class="input-error-message">
          {{ errors.first('tfaValue') }}
        </span>
      </div>

      <button class="button button-info max-width" @click.prevent="submit" @keyup.enter="submit" :class="{ 'button-loading': formLoading }" :disabled="formLoading">
        {{ formLoading ? $i18n.t('misc.LOADING') : $i18n.t('misc.CONTINUE') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tfaValue: null,
      formError: null,
      formLoading: false
    }
  },
  methods: {
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  },
  metaInfo: {
    title: 'Two Factor Auth'
  }
}
</script>
