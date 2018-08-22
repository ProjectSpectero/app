<template>
  <div>
    <h2>Two-factor auth</h2>

    <form
      v-if="enabled"
      @submit.prevent="submit">
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
        :class="{ 'button-loading': formLoading }"
        :disabled="formLoading"
        class="button-info max-width">
        {{ formLoading ? $i18n.t('misc.CONTINUE') : $i18n.t('misc.SAVE') }}
      </button>
    </form>
    <div v-else>
      <p>Click on the button below to activate two-factor authentication</p>
      <button @click="enable2FA">Enable 2FA</button>
    </div>
  </div>
</template>

<script>
import user from '@/app/api/user.js'

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
    enable2FA () {
      user.twoFactorAuth({
        action: 'enable',
        success: response => {
          console.log(response)
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    reset () {
      Object.assign(this.$data, this.$options.data.call(this))
    }
  }
}
</script>
