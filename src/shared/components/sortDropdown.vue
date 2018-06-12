<template>
  <dropdown>
    <template slot="btn">
      <button class="button-sort">{{ buttonText ? buttonText : 'Sort By' }}</button>
    </template>
    <template slot="body">
      <div class="dropdown-filters">
        <div class="sort-fields">
          <ul>
            <li @click="setCol(field)" v-for="(title, field) in sortFields" :key="field" :class="{'active': col === field}">{{ title }}</li>
          </ul>
        </div>
        <div class="sort-order">
          <ul>
            <li @click="setOrder('asc')" :class="{'active': order === 'asc'}"><span class="icon-arrow-up"></span> Ascending</li>
            <li @click="setOrder('desc')" :class="{'active': order === 'desc'}"><span class="icon-arrow-down"></span> Descending</li>
          </ul>
        </div>
        <button @click="applyFilters()" class="button-info full-width">Apply Filters</button>
      </div>
    </template>
  </dropdown>
</template>

<script>
import Dropdown from 'bp-vuejs-dropdown'

export default {
  props: {
    buttonText: String,
    sortFields: Object
  },
  data () {
    return {
      col: '',
      order: 'asc'
    }
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
  },
  created () {
    this.col = Object.keys(this.sortFields)[0]
    this.syncFilters()
  },
  components: {
    Dropdown
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
