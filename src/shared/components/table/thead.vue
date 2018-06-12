<template>
  <thead>
    <tr>
      <th
        v-for="column in columns"
        :key="column">
        <div
          v-if="(sortable.includes(column))"
          class="sortable"
          @click.stop="sortByColumn(column)">
          {{ headings[column] }}
          <span
            v-if="sortColumn === column"
            :class="['direction', sortDirection]"/>
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
    headings: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    sortable: {
      type: Array,
      required: false,
      default: () => []
    }
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
