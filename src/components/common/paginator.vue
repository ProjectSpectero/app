<template>
  <div v-if="pagination.total > 0" class="paginator">
    <div class="first" @click="toFirstPage">«</div>

    <ul class="pages">
      <li v-for="page in totalPages" :key="page" @click="toPage(page)" class="page">
        {{ page }}
      </li>
    </ul>

    <div class="last" @click="toLastPage">»</div>
  </div>
</template>

<script>
export default {
  props: {
    pagination: Object
  },
  computed: {
    totalPages () {
      return Math.ceil(this.pagination.total / this.pagination.per_page)
    }
  },
  methods: {
    toFirstPage () {
      this.$emit('changedPage', 1)
    },
    toLastPage () {
      this.$emit('changedPage', this.totalPages)
    },
    toPage (page) {
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
      }
    }
  }
</style>
