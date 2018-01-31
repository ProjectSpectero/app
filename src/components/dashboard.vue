<template>
  <div>
    <h1 v-if="user">
      Welcome, {{ user.name }}
    </h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  }
}
</script>
