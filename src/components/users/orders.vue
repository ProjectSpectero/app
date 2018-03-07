<template>
  <div>
    <top title="Orders"></top>
    <div class="content-split">
      <div class="split-item split-list filters-side">
        <router-link :to="{ name: 'orders' }" class="filter-link">
          <span>All orders</span>
          <div class="count">35</div>
        </router-link>
        <router-link :to="{ name: 'orders', params: { filter: 'active' } }" class="filter-link">
          <span>Active orders</span>
          <div class="count">3</div>
        </router-link>
        <router-link :to="{ name: 'orders', params: { filter: 'cancelled' } }" class="filter-link">
          <span>Cancelled orders</span>
          <div class="count">32</div>
        </router-link>
      </div>
      <div class="split-item split-details">
        <orders-list type="expanded"></orders-list>
      </div>
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
    title: 'Orders'
  }
}
</script>
