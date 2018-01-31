<template>
  <div>
    <form id="form-register">
      <div class="message error" v-if="formError">{{ formError }}</div>

      <div class="form-input">
        <input
          type="text"
          v-model="email"
          name="email"
          placeholder="Email address"
          class="input max-width"
          :class="{'input-error': errors.has('email')}"
          :disabled="formDisable"
          v-validate="'required|email'"
          data-vv-as="email">

        <span v-show="errors.has('email')" class="input-error-message">
          {{ errors.first('email') }}
        </span>
      </div>

      <div class="form-input">
        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Password"
          class="input max-width"
          :class="{'input-error': errors.has('password')}"
          :disabled="formDisable"
          v-validate="'required|min:5|max:72'"
          data-vv-as="password">

        <span v-show="errors.has('password')" class="input-error-message">
          {{ errors.first('password') }}
        </span>
      </div>

      <button class="button button-info button-md max-width" @click.prevent="submit" @keyup.enter="submit" :disabled="formDisable">{{ formDisable ? 'Please Wait' : 'Register' }}</button>
    </form>
    <div class="bottom-link">
      <router-link :to="{ name: 'login' }">Already have an account? <strong>Log in now</strong></router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      password: null,
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
