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

      <button @click.stop="add(false)" class="button">{{ $i18n.t('misc.ADD_TO_CART') }}</button>
      <button @click.stop="add(true)" class="button">{{ $i18n.t('misc.CHECKOUT') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  methods: {
    add (checkout) {
      let cart = JSON.parse(localStorage.getItem('specteroCart')) || []

      cart.push(this.item)
      localStorage.setItem('specteroCart', JSON.stringify(cart))

      console.log('current cart is', JSON.parse(localStorage.getItem('specteroCart')))

      this.$emit('close')

      if (checkout) {
        this.$router.push({ name: 'cart' })
      }
    }
  }
}
</script>
