<template>
  <div v-if="user">
    <h2>My Account</h2>

    <profile :user="user"></profile>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import profile from './profile'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  components: {
    profile
  }
}
</script>
