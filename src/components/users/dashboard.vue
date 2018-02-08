<template>
  <div>
    <h1>Welcome, {{ user.email }}</h1>

    <div class="orders">
      <h3>My orders</h3>
      <orders type="simple"></orders>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import orders from './orders'

export default {
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  components: {
    orders
  }
}
</script>
