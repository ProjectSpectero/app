<template>
  <div v-if="pagination.total" class="paginator">
    <div class="first" @click="toPage(1)">«</div>

    <ul class="pages">
      <li v-for="page in totalPages" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
        {{ page }}
      </li>
    </ul>

    <div class="last" @click="toPage(totalPages)">»</div>
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
  .paginator {
    display: flex;

    .first, .last {
      cursor: pointer;
    }

    .pages {
      .page {
        display: inline-block;
        cursor: pointer;

        &.active {
          color: red
        }
      }
    }
  }
</style>
