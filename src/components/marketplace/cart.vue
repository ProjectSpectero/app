<template>
  <div class="cart">
    <h2>Cart</h2>

    <ul>
      <li v-for="(item, index) in cart" :key="index">
        {{ item.friendly_name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cart: []
    }
  },
  created () {
    this.fetchCart()
  },
  methods: {
    fetchCart () {
      this.cart = JSON.parse(localStorage.getItem('specteroCart'))
    }
  }
}
</script>

<style>

</style>
