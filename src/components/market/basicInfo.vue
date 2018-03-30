<template>
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
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>

<style>

</style>
