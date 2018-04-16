<template>
  <div>
    <h1>Node #{{ node.id }} <span v-if="node.friendly_name">({{ node.friendly_name }})</span></h1>
    <h3 v-if="group">In group #{{ group.id }} <span v-if="group.friendly_name">({{ node.friendly_name }})</span></h3>
    <ul>
      <li>Name: {{ node.friendly_name }}</li>
      <li>IP: {{ node.ip }}</li>
      <li>City: {{ node.city }}</li>
      <li>Access Token: {{ node.access_token }}</li>
      <li>Protocol: {{ node.protocol }}</li>
      <li>Market Model: {{ node.market_model }}</li>
      <li>Price: {{ node.price }}</li>
      <li v-if="group">Group #: {{ group.id }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    group: {
      type: Object,
      default: null
    }
  }
}
</script>
