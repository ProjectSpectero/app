<template>
  <div>
    <h2>Two-factor auth</h2>

    <form v-if="enabled" @submit.prevent="submit">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="tfaValue"
          name="tfaValue"
          placeholder="Enter TFA Key"
          class="input max-width"
          :class="{'input-error': errors.has('tfaValue')}"
          :disabled="formDisable"
          v-validate="'required'"
          data-vv-as="two factor authentication key">

        <span v-show="errors.has('tfaValue')" class="input-error-message">
          {{ errors.first('tfaValue') }}
        </span>
      </div>

      <button class="button button-info max-width" :disabled="formDisable">
        {{ formDisable ? $i18n.t('misc.CONTINUE') : $i18n.t('misc.SAVE') }}
      </button>
    </form>
    <div v-else>
      <p>Click on the button below to activate two-factor authentication</p>
      <button @click="enable2FA">Enable 2FA</button>
    </div>
  </div>
</template>

<script>
import user from '@/api/user.js'

export default {
  data () {
    return {
      tfaValue: null,
      formError: null,
      formDisable: false
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
  },
  metaInfo: {
    title: 'Two Factor Auth'
  }
}
</script>
