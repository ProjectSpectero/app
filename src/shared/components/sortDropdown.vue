<template>
  <dropdown>
    <template slot="btn">
      <button class="button-sort">{{ buttonText ? buttonText : 'Sort By' }}</button>
    </template>
    <template slot="body">
      <div class="dropdown-filters">
        <div class="sort-fields">
          <ul>
            <li
              v-for="(title, field) in sortFields"
              :key="field"
              :class="{'active': col === field}"
              @click="setCol(field)">{{ title }}</li>
          </ul>
        </div>
        <div class="sort-order">
          <ul>
            <li
              :class="{'active': order === 'asc'}"
              @click="setOrder('asc')"><span class="icon-arrow-up"/> Ascending</li>
            <li
              :class="{'active': order === 'desc'}"
              @click="setOrder('desc')"><span class="icon-arrow-down"/> Descending</li>
          </ul>
        </div>
        <button
          class="button-info full-width"
          @click="applyFilters()">Apply Filters</button>
      </div>
    </template>
  </dropdown>
</template>

<script>
import Dropdown from 'bp-vuejs-dropdown'

export default {
  components: {
    Dropdown
  },
  props: {
    buttonText: {
      type: String,
      required: false,
      default: 'Dropdown Button'
    },
    sortFields: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      col: '',
      order: 'asc'
    }
  },
  created () {
    this.col = Object.keys(this.sortFields)[0]
    this.syncFilters()
  },
  methods: {
    setCol (col) {
      this.col = col
    },
    setOrder (order) {
      this.order = order
    },
    applyFilters () {
      this.$root.$emit('bp-dropdown:hide')
      this.syncFilters()
    },
    syncFilters () {
      this.$emit('sortUpdate', {
        col: this.col,
        order: this.order
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/icons';

.dropdown-filters {
  padding: 16px;
  padding-top: 10px;
}
ul {
  list-style: none;
}
li {
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 0;
  cursor: pointer;

  [class^="icon-"] {
    margin-right: 6px;
    color: rgba(0,0,0,0.3);
  }
  &:after {
    @extend [class^="icon-"];

    width: 16px;
    height: 16px;
    position: absolute;
    top: auto;
    right: 0;
    font-size: 16px;
    content: '';
  }
  &.active {
    font-weight: $font-semi;

    [class^="icon-"] {
      color: $color-info;
    }
    &:after {
      @extend .icon-check:before;

      color: $color-info;
    }
  }
}
.sort-order {
  margin: 12px 0 16px 0;
  padding: 12px 0;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
}
</style>
