<template>
  <div v-if="pagination && pagination.total" class="pagination">
    <div class="paginator">
      <div @click="toPage(1)" :class="['page', 'first', (active === 1) ? 'disabled' : '']">«</div>

      <div @click="toPage(active-1)" :class="['page', 'previous', (active === 1) ? 'disabled' : '']">🢐</div>

      <ul class="pages">
        <template v-if="showStartEllipsis">
          <li class="ellipsis">...</li>
        </template>

        <li v-for="page in firstChunk" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
          {{ page }}
        </li>

        <template v-if="showMiddleEllipsis">
          <li class="ellipsis">...</li>
        </template>

        <template v-if="lastChunk.length">
          <li v-for="page in lastChunk" :key="page" @click="toPage(page)" :class="['page', (active === page) ? 'active' : '']">
            {{ page }}
          </li>
        </template>
      </ul>

      <div @click="toPage(active+1)" :class="['page', 'next', (active === totalPages) ? 'disabled' : '']">🢒</div>

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

      if (this.active - 1 > 1) {
        chunk.push(this.active - 1)
      }

      chunk.push(this.active)
      chunk.push(this.active + 1)

      if (this.active + 2 < this.totalPages) {
        chunk.push(this.active + 2)
      }

      return chunk
    },
    lastChunk () {
      let chunk = []
      let number = this.totalPages
      const max = (this.totalPages > 3) ? 3 : this.totalPages

      for (let i = 0; i < max; i++) {
        const found = this.firstChunk.find(n => n === number)

        if (!found) {
          chunk.unshift(number)
        }

        number--
      }

      return chunk
    },
    showMiddleEllipsis () {
      const fc = this.firstChunk.length
      const lc = this.lastChunk.length
      return (this.totalPages - fc - lc > 0 && (this.firstChunk[this.lastChunk.length] + 1 !== this.lastChunk[0]) && this.active !== this.totalPages)
    },
    showStartEllipsis () {
      const fc = this.firstChunk.length
      return (this.active > fc && !this.showMiddleEllipsis)
    },
    active () {
      return this.pagination.current_page || 1
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
