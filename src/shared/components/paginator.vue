<template>
  <div
    v-if="pagination"
    class="pagination">
    <div class="paginator">
      <div
        :class="['page', 'page-arrow', 'first', (active === 1) ? 'disabled' : '']"
        @click="toPage(1)">
        <span class="icon-chevrons-left"/>
      </div>

      <div
        :class="['page', 'page-arrow', 'previous', (active === 1) ? 'disabled' : '']"
        @click="toPage(active - 1)">
        <span class="icon-chevron-left"/>
      </div>

      <template v-if="totalPages > 5 ">
        <ul class="pages">
          <li
            :class="['page', (active === 1) ? 'active' : '']"
            @click="toPage(1)">1</li>

          <li
            v-if="showFirstEllipsis"
            class="page">...</li>

          <li
            v-for="page in firstChunk"
            :key="page"
            :class="['page', (active === page) ? 'active' : '']"
            @click="toPage(page)">
            {{ page }}
          </li>

          <li
            v-for="page in lastChunk"
            :key="page"
            :class="['page', (active === page) ? 'active' : '']"
            @click="toPage(page)">
            {{ page }}
          </li>

          <li
            v-if="showLastEllipsis"
            class="page">...</li>

          <li
            :class="['page', (active === totalPages) ? 'active' : '']"
            @click="toPage(totalPages)">{{ totalPages }}</li>
        </ul>
      </template>

      <template v-else>
        <ul class="pages">
          <li
            v-for="page in planePages"
            :key="page"
            :class="['page', (active === page) ? 'active' : '']"
            @click="toPage(page)">
            {{ page }}
          </li>
        </ul>
      </template>

      <div
        :class="['page', 'page-arrow', 'next', (active === totalPages) ? 'disabled' : '']"
        @click="toPage(active + 1)"><span class="icon-chevron-right"/></div>

      <div
        :class="['page', 'page-arrow', 'last', (active === totalPages) ? 'disabled' : '']"
        @click="toPage(totalPages)"><span class="icon-chevrons-right"/></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: false,
      default: () => {}
    }
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
  watch: {
    pagination: {
      handler (futurePagination, pastPagination) {
        if (pastPagination && futurePagination.last_page < pastPagination.last_page) {
          this.toPage(1)
        }
      },
      deep: true
    }
  },
  created () {
    // console.log(this.pagination)
  },
  methods: {
    toPage (page) {
      this.$emit('changedPage', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.paginator {
  padding: 6px;
  background: $white;
  border: 1px solid $color-border;
  border-radius: 4px;

  .pages {
    float: left;
    list-style: none;
  }

  .page,
  .ellipsis {
    width: 32px;
    line-height: 32px;
    display: inline-block;
    margin: 0 2px;
    color: lighten($color-primary, 30%);
    font-size: 14px;
    font-weight: $font-bold;
    text-align: center;
    transition: all 0.1s ease-out;
  }

  .page {
    float: left;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      color: $color-info;
      background: lighten($color-info, 53%);
    }

    &.active {
      color: $white;
      background-color: $color-info;
    }

    &.disabled {
      pointer-events: none;
      color: $color-light;
      cursor: not-allowed;
    }
  }
  [class^="icon-"] {
    position: relative;
    top: 2px;
    font-size: 110%;
  }
  .page-arrow {
    padding: 0 10px;
  }
}
</style>
