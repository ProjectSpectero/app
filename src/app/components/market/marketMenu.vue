<template>
  <div class="col-12">
    <div class="menu">
      <ul>
        <li
          v-for="(item, index) in routes"
          :key="index"
          :class="{ active: item.route === $route.name }">
          <a
            href="#"
            @click.prevent.stop="selectRoute(item.route)">
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: [
        { label: 'Listed nodes', route: 'marketListed' },
        { label: 'My listings', route: 'marketMine' }
      ]
    }
  },
  methods: {
    selectRoute (route) {
      this.$emit('selectedRoute', route)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;

  ul {
    > li {
      display: inline-block;
      padding: 14px;
      background: $white;
      border: 1px solid $color-border;
      border-radius: 4px;
      cursor: pointer;

      &.active {
        font-weight: 600;
      }
    }
  }
}
</style>
