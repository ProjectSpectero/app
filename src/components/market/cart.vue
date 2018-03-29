<template>
  <div class="cart">
    <h2>{{ $i18n.t('misc.CART') }}</h2>

    <div v-if="cart && cart.length">
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          {{ item.friendly_name }}

          <router-link class="button button-success" :to="{ name: 'marketView', params: { type: parseType(item.type), id: item.id } }">
            {{ $i18n.t('misc.VIEW') }}
          </router-link>
          <button class="button" @click.stop="remove(item)">
            {{ $i18n.t('misc.REMOVE') }}
          </button>
        </li>
      </ul>

      <button class="button" @click.stop="pay">
        {{ $i18n.t('misc.PAY_NOW') }}
      </button>
    </div>
    <div v-else>
      <p>{{ $i18n.t('market.CART_EMPTY') }}</p>
    </div>
  </div>
</template>

<script>
import marketAPI from '@/api/market.js'
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    this.refreshCart()
  },
  computed: {
    ...mapGetters({
      cart: 'market/cart'
    })
  },
  methods: {
    ...mapActions({
      refreshCart: 'market/refreshCart',
      removeFromCart: 'market/removeFromCart',
      clearCart: 'market/clearCart'
    }),
    parseType (type) {
      if (type.toLowerCase() === 'node') {
        return 'node'
      }

      return 'group'
    },
    pay () {
      marketAPI.order({
        data: {
          items: this.cart,
          meta: {
            'term': 30
          }
        },
        success: response => {
          this.clearCart()
          this.$toasted.success(this.$i18n.t('market.ORDER_PROCESSED', { invoice: response.data.result.last_invoice_id }))
        },
        fail: error => this.$toasted.error(this.errorAPI(error, 'market'))
      })
    },
    remove (item) {
      this.removeFromCart(item)
      this.$toasted.success(this.$i18n.t('market.REMOVED_FROM_CART', { name: item.friendly_name }))
    }
  },
  metaInfo: {
    title: 'Your cart'
  }
}
</script>

<style>

</style>
