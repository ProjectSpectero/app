<template>
  <form id="form-register">
    <div class="message error" v-if="formError">{{ formError }}</div>

    <div class="form-input">
      <input type="text" class="input max-width" v-model="email" name="email" :disabled="formDisable" placeholder="Email address" v-validate="'required|email'" data-vv-as="email address" :class="{'input-error': errors.has('email')}">
      <span v-show="errors.has('email')" class="input-error-message">
        {{ errors.first('email') }}
      </span>
    </div>

    <div class="form-input">
      <input type="password" class="input max-width" v-model="password" name="password" :disabled="formDisable" placeholder="Password" v-validate="'required|min:5|max:72'" data-vv-as="password" :class="{'input-error': errors.has('password')}">
      <span v-show="errors.has('password')" class="input-error-message">
        {{ errors.first('password') }}
      </span>
    </div>

    <button class="button button-info max-width" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">{{ formDisable ? 'Please Wait' : 'Register' }}</button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      passowrd: null,
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
    title: 'Register'
  }
}
</script>
