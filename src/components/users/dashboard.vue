<template>
  <div>
    <top title="Dashboard"></top>
    <div class="orders">
      <orders-list type="simple"></orders-list>
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
