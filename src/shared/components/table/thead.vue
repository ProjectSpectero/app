<template>
  <thead>
    <tr>
      <th v-for="column in columns" :key="column">
        <div v-if="(sortable.includes(column))" @click.stop="sortByColumn(column)" class="sortable">
          {{ headings[column] }}
          <span v-if="sortColumn === column" :class="['direction', sortDirection]"></span>
        </div>
        <div v-else>
          {{ headings[column] !== undefined ? headings[column] : column }}
        </div>
      </th>
    </tr>
  </thead>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    headings: Object,
    columns: Array,
    sortable: Array
  },
  computed: {
    ...mapGetters({
      sortColumn: 'table/sortColumn',
      sortDirection: 'table/sortDirection'
    })
  },
  methods: {
    ...mapActions({
      setSort: 'table/setSort'
    }),
    sortByColumn (column) {
      this.setSort({
        column: column,
        direction: (this.sortDirection === 'asc') ? 'desc' : 'asc'
      })

      this.$emit('sortByColumn')
    }
  }
}
</script>
