<template>
  <div v-if="tableData">
    <div class="datatable">
      <table>
        <table-header :columns="columns" :headings="headings" :sortable="sortable"/>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <div :class="'badge status-' + row.status.toLowerCase()">
                {{ $i18n.t('orders.ORDER_STATUS.' + row.status) }}
              </div>
            </td>
            <td>
              <router-link class="button" :to="{ name: 'order', params: { id: row.id } }">
                {{ $i18n.t('misc.VIEW') }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import paginator from '@/components/common/paginator'
import tableHeader from '@/components/common/table/thead'

export default {
  props: {
    pagination: Object,
    tableData: Array
  },
  data () {
    return {
      headings: {
        id: 'Order ID',
        status: 'Status',
        actions: ''
      },
      columns: ['id', 'status', 'actions'],
      sortable: []
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
