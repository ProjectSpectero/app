<template>
  <div>
    <div class="orders">
      <h1>My orders</h1>
      <orders type="expanded"></orders>
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
  methods: {
    switchType (type) {
      this.type = type
    }
  },
  components: {
    orders
  }
}
</script>
