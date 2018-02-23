<template>
  <div v-if="user">
    <h2>My Account</h2>

    <profile :user="user"></profile>

    <configs :user="user"></configs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import profile from './profile'
import configs from './configs'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  components: {
    profile,
    configs
  }
}
</script>
