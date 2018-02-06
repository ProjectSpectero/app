<template>
  <div>
    <h1>
      Welcome, {{ user.email }}
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
