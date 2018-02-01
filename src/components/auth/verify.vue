<template>
  <div>
    <h2>Welcome to Spectero!</h2>
    <p>We have sent you a verification email. Please click on the provided link to verify your account.</p>
    <router-link :to="{ name: 'login' }">Back to login page</router-link>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Verify Email'
  }
}
</script>
