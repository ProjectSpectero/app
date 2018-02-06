<template>
  <div v-if="verified">
    <h2>Great success!</h2>
    <p>Your account {{ $route.params.email }} is now verified.</p>
    <p>Please proceed to the <router-link :to="{ name: 'login' }">login page</router-link> to access Spectero.</p>
  </div>
  <div v-else>
    <div v-if="error">
      <h2>Something went wrong!</h2>

      <div v-if="error === 'USER_ALREADY_VERIFIED'">
        <p>Your account is already verified!</p>
        <p>Please proceed to the <router-link :to="{ name: 'login' }">login page</router-link> to access Spectero.</p>
      </div>
      <div v-else>
        <p>We were unable to verify your account. Please try again later.</p>
      </div>
    </div>
    <div v-else>
      <h2>Verifying ...</h2>
      <p>Please wait while we validate your account.</p>
    </div>
  </div>
</template>

<script>
import user from '@/api/user.js'

export default {
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
  },
  metaInfo: {
    title: 'Verify Email'
  }
}
</script>
