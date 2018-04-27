<template>
  <div v-if="pagination && pagination.total" class="pagination">
    <div class="paginator">
      <div @click="toPage(1)" :class="['page', 'first', (active === 1) ? 'disabled' : '']">«</div>

      <div @click="toPage(active - 1)" :class="['page', 'previous', (active === 1) ? 'disabled' : '']">🢐</div>

      <template v-if="totalPages > 5 ">
        <ul class="pages">
          <li @click="toPage(1)" :class="['page', (active === 1) ? 'active' : '']">1</li>

          <li v-if="showFirstEllipsis" class="page">...</li>

          <li v-for="page in firstChunk" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
            {{ page }}
          </li>

          <li v-for="page in lastChunk" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
            {{ page }}
          </li>

          <li v-if="showLastEllipsis" class="page">...</li>

          <li @click="toPage(totalPages)" :class="['page', (active === totalPages) ? 'active' : '']">{{ totalPages }}</li>
        </ul>
      </template>

      <template v-else>
        <ul class="pages">
          <li v-for="page in planePages" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
            {{ page }}
          </li>
        </ul>
      </template>

      <div @click="toPage(active + 1)" :class="['page', 'next', (active === totalPages) ? 'disabled' : '']">🢒</div>

      <div @click="toPage(totalPages)" :class="['page', 'last', (active === totalPages) ? 'disabled' : '']">»</div>
    </div>
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
    },
    firstChunk () {
      let chunk = []

      if (this.active === 1) {
        chunk.push(2, 3)
      } else if ((this.active - 1) <= 3) {
        for (let i = 2; i <= this.active + 1; i++) {
          chunk.push(i)
        }
      } else if ((this.totalPages - this.active) > 1) {
        for (let i = this.active - 1; i <= this.active + 1; i++) {
          chunk.push(i)
        }
      }

      return chunk
    },
    lastChunk () {
      let chunk = []

      if (this.totalPages === this.active) {
        for (let i = this.active - 1; i >= this.active - 2; i--) {
          chunk.push(i)
          chunk.reverse()
        }
      } else if ((this.totalPages - this.active) <= 3) {
        for (let i = this.totalPages - 1; i >= this.active - 1; i--) {
          const found = this.firstChunk.find(page => page === i)

          if (!found) {
            chunk.push(i)
            chunk.reverse()
          }
        }
      }

      return chunk
    },
    showFirstEllipsis () {
      return (this.active - 1 > 3)
    },
    showLastEllipsis () {
      return (this.totalPages - this.active > 3)
    },
    active () {
      return this.pagination.current_page || 1
    },
    planePages () {
      let pages = []

      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  methods: {
    toPage (page) {
      this.$emit('changedPage', page)
    }
  },
  watch: {
    pagination: {
      handler (futurePagination, pastPagination) {
        if (pastPagination && futurePagination.last_page < pastPagination.last_page) {
          this.toPage(1)
        }
      },
      deep: true
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

  .page,
  .ellipsis {
    display: inline-block;
    padding: 0 14px;
    line-height: 30px;
    font-size: 14px;
    font-weight: $font-bold;
  }

  .page {
    cursor: pointer;
    background-color: $white;
    border-radius: 4px;

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

  .previous, .next {
    font-size: 20px;
  }
}
</style>
