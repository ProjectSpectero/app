<template>
  <div v-if="tableData">
    <div class="datatable">
      <table>
        <table-header :columns="columns" :headings="headings" :sortable="sortable" @sortByColumn="sortByColumn"/>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <div :class="'badge status-' + row.status.toLowerCase()">
                {{ $i18n.t('orders.ORDER_STATUS.' + row.status) }}
              </div>
            </td>
            <td>{{ row.created_at | moment('MMM D, YYYY') }}</td>
            <td>{{ row.due_next | moment('MMM D, YYYY') }}</td>
            <td>{{ row.last_invoice.amount | currency }} {{ row.last_invoice.currency }}</td>
            <td>
              <router-link class="button" :to="{ name: 'order', params: { id: row.id } }">
                {{ $i18n.t('misc.VIEW') }}
              </router-link>

              <div class="inline" v-if="row.last_invoice && row.last_invoice.status === 'UNPAID'">
                <router-link class="button button-success" :to="{ name: 'invoice', params: { id: row.last_invoice.id } }">
                  {{ $i18n.t('misc.PAY_NOW') }}
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <paginator v-if="type !== 'simple'" :pagination="pagination" @changedPage="changedPage"></paginator>
  </div>
</template>

<script>
import paginator from '@/components/common/paginator'
import tableHeader from '@/components/common/table/thead'

export default {
  props: {
    searchId: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'simple'
    },
    pagination: Object,
    tableData: Array
  },
  data () {
    return {
      perPage: 10,
      headings: [],
      columns: [],
      sortable: []
    }
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {
      this.perPage = (this.type === 'simple') ? 3 : 10
      this.sortable = (this.type === 'simple')
        ? ['id', 'status']
        : ['id', 'status', 'created_at', 'due_next']
      this.columns = (this.type === 'simple')
        ? ['id', 'status', 'actions']
        : ['id', 'status', 'created_at', 'due_next', 'total', 'actions']
      this.headings = (this.type === 'simple')
        ? {
          id: 'Order ID',
          status: 'Status',
          actions: ''
        } : {
          id: 'Order ID',
          status: 'Status',
          created_at: 'Created',
          due_next: 'Next Date Due',
          total: 'Total',
          actions: ''
        }
    },
    sortByColumn (data) {
      this.$emit('sortByColumn', data)
    },
    changedPage (page) {
      this.$emit('changedPage', page)
    }
  },
  components: {
    paginator,
    tableHeader
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-active {
    @extend .badge-success
  }
  &.status-automated_fraud_check, &.status-manual_fraud_check {
    @extend .badge-warning
  }
}
</style>
