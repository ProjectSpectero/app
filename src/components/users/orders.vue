<template>
  <div>
    <top title="Orders"></top>
    <div class="orders">
      <orders-list type="expanded"></orders-list>
    </div>
  </div>
</template>

<script>
import Top from '../common/top'
import ordersList from './ordersList'

export default {
  components: {
    Top,
    ordersList
  }
}
</script>
