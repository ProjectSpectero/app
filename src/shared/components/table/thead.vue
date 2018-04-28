<template>
  <thead>
    <tr>
      <th v-for="column in columns" :key="column">
        <div v-if="(sortable.includes(column))" @click.stop="sortByColumn(column)" class="sortable">
          {{ headings[column] }}
          <span v-if="sort.column === column" :class="['direction', sort.direction]"></span>
        </div>
        <div v-else>
          {{ headings[column] !== undefined ? headings[column] : column }}
        </div>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: {
    headings: Object,
    columns: Array,
    sortable: Array
  },
  data () {
    return {
      sort: {
        column: 'id',
        direction: 'desc'
      }
    }
  },
  methods: {
    sortByColumn (column) {
      this.sort = {
        column: column,
        direction: (this.sort.direction === 'asc') ? 'desc' : 'asc'
      }

      this.$emit('sortByColumn', this.sort)
    }
  }
}
</script>
