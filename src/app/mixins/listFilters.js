import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      rules: [],
      searchId: null,
      pagination: null,
      tableData: null
    }
  },
  computed: {
    ...mapGetters({
      sortColumn: 'table/sortColumn',
      sortDirection: 'table/sortDirection'
    }),
    currentPage () {
      return (this.$route.params.page !== undefined) ? this.$route.params.page : 1
    }
  },
  methods: {
    sidebarSort (field, current, page) {
      if (this.status.find(s => s === current)) {
        // The list comes sorted by id desc by default
        this.rules = [{
          operator: 'SORT',
          field: 'id',
          value: 'DESC'
        }]

        // Append status filter
        if (current !== 'all') {
          this.rules.push({
            field: field,
            operator: '=',
            value: current.toUpperCase()
          })
        } else {
          this.removeFilter('=')
        }
      } else {
        // Erroneous status? Throw error
        this.errorCode = 400
        this.error = true
        return
      }

      this.fetch(page)
    },
    sortByColumn () {
      this.removeFilter('SORT')

      this.rules.push({
        operator: 'SORT',
        field: this.sortColumn,
        value: this.sortDirection.toUpperCase()
      })

      this.fetch(1)
    },
    removeFilter (operator) {
      const index = this.rules.findIndex(r => r.operator === operator)

      if (index !== -1) {
        this.rules.splice(index, 1)
      }
    },
    search (value) {
      if (value.length >= 2) {
        this.removeFilter('SORT')
        this.removeFilter('LIKE')

        this.rules.push({
          operator: 'LIKE',
          field: 'due_next',
          value: '%' + value + '%'
        })
      } else if (value.length === 0) {
        this.removeFilter('LIKE')
      }

      this.fetch()
    },
    reset () {
      this.rules.forEach(r => {
        if (r.field !== 'status') {
          const i = this.rules.indexOf(r)
          this.rules.splice(i, 1)
        }
      })
      this.fetch()
    }
  }
}
