<template>
  <form id="loginForm">
    <div class="message error" v-if="formError">{{ formError }}</div>

    <div class="form-input">
      <input type="text" class="input max-width" v-model="tfaValue" name="tfaValue" :disabled="formDisable" placeholder="Enter TFA Key" v-validate="'required'" data-vv-as="two factor authentication key" :class="{'input-error': errors.has('tfaValue')}">
      <span v-show="errors.has('tfaValue')" class="input-error-message">
        {{ errors.first('tfaValue') }}
      </span>
    </div>

    <button class="button button-info max-width" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">{{ formDisable ? 'Please Wait' : 'Continue' }}</button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      tfaValue: null,
      formError: null,
      formDisable: false
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
