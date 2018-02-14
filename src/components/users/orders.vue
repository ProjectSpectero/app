<template>
  <div>
    <div class="orders">
      <h1>My orders</h1>
      <orders-list type="expanded"></orders-list>
    </div>
  </div>
</template>

<script>
import ordersList from './ordersList'

export default {
  components: {
    ordersList
  }
}
</script>
