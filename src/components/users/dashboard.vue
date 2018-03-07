<template>
  <div>
    <top title="Dashboard"></top>
    <div class="orders">
      <h2>Orders</h2>
      <orders-list type="simple"></orders-list>
    </div>
  </div>
</template>

<script>
import top from '@/components/common/top'
import ordersList from './ordersList'

export default {
  components: {
    top,
    ordersList
  },
  metaInfo: {
    title: 'Dashboard'
  }
}
</script>

<style lang="scss" scoped>
.orders {
  width: 50%;
}
</style>
