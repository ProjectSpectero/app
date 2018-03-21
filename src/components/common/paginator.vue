<template>
  <div v-if="pagination && pagination.total" class="pagination">
    <div class="paginator">
      <div @click="toPage(1)" :class="['page', 'first', (active === 1) ? 'disabled' : '']">«</div>

      <ul class="pages">
        <li v-for="page in totalPages" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
          {{ page }}
        </li>
      </ul>

      <div @click="toPage(totalPages)" :class="['page', 'last', (active === totalPages) ? 'disabled' : '']">»</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pagination: Object
  },
  data () {
    return {
      active: 1
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.pagination.total / this.pagination.per_page)
    }
  },
  methods: {
    toPage (page) {
      this.active = page
      this.$emit('changedPage', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.paginator {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid $color-border;

  .pages {
    display: inline-block;
    list-style: none;
  }

  .page {
    display: inline-block;
    padding: 0 14px;
    line-height: 30px;
    font-size: 14px;
    font-weight: $font-bold;
    background-color: $white;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: $color-border;
    }

    &.active {
      color: $white;
      background-color: $color-info;
    }

    &.disabled {
      pointer-events: none;
      color: $color-light;
      cursor: disabled;
    }
  }
}
</style>
