<template>
  <div class="verify">
    <div v-if="verified">
      <h2>Account Activated!</h2>
      <p>Your account with email <strong>{{ $route.params.email }}</strong> is now activated. Use the button below to login.</p>
      <br>
      <router-link
        :to="{ name: 'login' }"
        class="button">Go to Login</router-link>
    </div>
    <div v-else>
      <div v-if="error">
        <div v-if="error === 'USER_ALREADY_VERIFIED'">
          <p class="message message-success">Your account is already verified!</p>
          <p>Click the button below to login now.</p>
          <br>
          <router-link
            :to="{ name: 'login' }"
            class="button">Go to Login</router-link>
        </div>
        <div v-else>
          <p class="message message-error">We were unable to verify your account. Please try again later.</p>
          <router-link
            :to="{ name: 'login' }"
            class="button">Go to Login</router-link>
        </div>
      </div>
      <div v-else>
        <h2>Verifying...</h2>
        <p>Please wait while we validate your account.</p>
      </div>
    </div>
  </div>
</template>

<script>
import user from '@/app/api/user.js'

export default {
  metaInfo: {
    title: 'Verify Email'
  },
  data () {
    return {
      verified: false,
      error: null,
      errorMessage: ''
    }
  },
  created () {
    this.validateVerification()
  },
  methods: {
    validateVerification () {
      user.verify({
        data: {
          email: this.$route.params.email,
          token: this.$route.params.token
        },
        success: response => {
          this.error = null
          this.verified = true
        },
        fail: error => {
          const keys = Object.keys(error.errors)

          this.error = keys[0]
          this.verified = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.verify {
  text-align: center;
}
</style>
