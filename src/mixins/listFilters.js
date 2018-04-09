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
    currentPage () {
      return (this.$route.params.page !== undefined) ? this.$route.params.page : 1
    }
  },
  methods: {
    sidebarSort (field, current, page) {
      if (this.status.find(s => s === current)) {
        if (current !== 'all') {
          this.rules = [{ field: field, operator: '=', value: current.toUpperCase() }]
        } else {
          this.removeFilter('=')
        }
      }

      this.fetch(page)
    },
    sortByColumn (data) {
      this.removeFilter('SORT')

      this.rules.push({
        field: data.column,
        operator: 'SORT',
        value: data.direction.toUpperCase()
      })

      console.log('Sorting by column with', this.rules)

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
          field: 'due_next',
          operator: 'LIKE',
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
