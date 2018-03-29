<template>
  <div>
    <div class="modal-close" @click="$emit('close')">&#215;</div>

    <div>
      <h2>{{ item.friendly_name }}</h2>
      <ul>
        <li v-if="item.asn">ASN: {{ item.asn }}</li>
        <li v-if="item.city">City: {{ item.city }}</li>
        <li v-if="item.cc">Country Code: {{ item.cc }}</li>
        <li>Market model: {{ item.market_model }}</li>
        <li>Status: {{ item.status }}</li>
        <li>Price: {{ item.price }}</li>
        <li v-if="item.plan">{{ item.plan }}</li>
      </ul>

      <button @click.stop="add(item, false)" class="button">{{ $i18n.t('misc.ADD_TO_CART') }}</button>
      <button @click.stop="add(item, true)" class="button">{{ $i18n.t('misc.CHECKOUT') }}</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    item: Object
  },
  methods: {
    ...mapActions({
      addToCart: 'marketplace/addToCart'
    }),
    add (item, checkout) {
      this.addToCart(item)
      this.$emit('close')
      this.$toasted.success(item.friendly_name + ' added to cart!')

      if (checkout) {
        this.$router.push({ name: 'cart' })
      }
    }
  }
}
</script>
