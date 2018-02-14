<template>
  <div>
    <div class="orders">
      <h1>Dashboard</h1>
      <orders-list type="simple"></orders-list>
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
