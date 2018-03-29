<template>
  <div class="cart">
    <h2>Cart</h2>

    <ul v-if="cart && cart.length">
      <li v-for="(item, index) in cart" :key="index">
        {{ item.friendly_name }}

        <router-link class="button button-success" :to="{ name: 'marketplaceView', params: { type: parseType(item.type), id: item.id } }">
          {{ $i18n.t('misc.VIEW') }}
        </router-link>
        <button class="button" @click.stop="remove(item)">Remove</button>
      </li>
    </ul>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    this.refreshCart()
  },
  computed: {
    ...mapGetters({
      cart: 'marketplace/cart'
    })
  },
  methods: {
    ...mapActions({
      refreshCart: 'marketplace/refreshCart',
      removeFromCart: 'marketplace/removeFromCart'
    }),
    parseType (type) {
      if (type.toLowerCase() === 'node') {
        return 'node'
      }

      return 'group'
    },
    remove (item) {
      this.removeFromCart(item)
      this.$toasted.success(item.friendly_name + ' was removed from your cart!')
    }
  }
}
</script>

<style>

</style>
