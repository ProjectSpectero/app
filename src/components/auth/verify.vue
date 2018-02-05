<template>
  <div v-if="verified">
    <h2>Great success!</h2>
    <p>Your account {{ $route.params.email }} is now verified.</p>
    <p>Please proceed to the <router-link :to="{ name: 'login' }">login page</router-link> to access Spectero.</p>
  </div>
  <div v-else>
    <div v-if="error">
      <h2>Something went wrong!</h2>
      <p>We were unable to verify your account. Please try again later.</p>
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
      error: false
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
          this.error = false
          this.verified = true
        },
        fail: error => {
          console.log(error)
          this.error = true
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
