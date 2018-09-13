<template>
  <div>
    <form id="form-tfa">
      <div
        v-if="formError"
        class="message message-error">{{ formError }}</div>

      <div class="form-input">
        <input
          v-validate="'required'"
          v-model="tfaValue"
          :class="{'input-error': errors.has('tfaValue')}"
          :disabled="formLoading"
          type="text"
          name="tfaValue"
          placeholder="Enter TFA Key"
          class="input max-width"
          data-vv-as="two factor authentication key">

        <span
          v-show="errors.has('tfaValue')"
          class="input-error-message"
          v-html="errors.first('tfaValue')"/>
      </div>

      <button
        :class="{ 'is-loading': formLoading }"
        :disabled="formLoading"
        class="button is-info max-width"
        @click.prevent="submit"
        @keyup.enter="submit">
        {{ formLoading ? $t('misc.LOADING') : $t('misc.CONTINUE') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Two Factor Auth'
  },
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
  }
}
</script>
