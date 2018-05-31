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
            <td class="table-actions">
              <template v-if="row.status !== 'CANCELLED'">
                <router-link v-if="row.status !== 'CANCELLED' && row.last_invoice && row.last_invoice.status === 'UNPAID'" class="button button-success" :to="{ name: 'invoice', params: { id: row.last_invoice.id } }">
                  {{ $i18n.t('misc.PAY_NOW') }}
                </router-link>
              </template>

              <router-link class="button button-info" :to="{ name: 'order', params: { id: row.id } }">
                {{ $i18n.t('misc.VIEW') }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <paginator :pagination="pagination" @changedPage="changedPage"></paginator>
  </div>
</template>

<script>
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  props: {
    searchId: {
      type: String,
      default: null
    },
    pagination: Object,
    tableData: Array
  },
  data () {
    return {
      perPage: 10,
      headings: {
        id: 'Order ID',
        status: 'Status',
        created_at: 'Created',
        due_next: 'Next Date Due',
        total: 'Total',
        actions: ''
      },
      columns: ['id', 'status', 'created_at', 'due_next', 'total', 'actions'],
      sortable: ['id', 'status', 'created_at', 'due_next']
    }
  },
  methods: {
    sortByColumn () {
      this.$emit('sortByColumn')
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
    @extend .badge-success;
  }
  &.status-automated_fraud_check, &.status-manual_fraud_check {
    @extend .badge-warning;
  }
}
</style>
