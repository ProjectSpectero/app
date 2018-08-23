<template>
  <div>
    <div v-if="tableData">
      <div
        v-if="tableData.length"
        class="datatable">
        <table>
          <table-header
            :columns="columns"
            :headings="headings"
            :sortable="sortable"/>
          <tbody>
            <tr
              v-for="row in tableData"
              :key="row.id">
              <td>{{ row.id }}</td>
              <td>
                <div :class="'badge status-' + row.status.toLowerCase()">
                  {{ $t('orders.ORDER_STATUS.' + row.status) }}
                </div>
              </td>
              <td>
                <router-link
                  :to="{ name: 'order', params: { id: row.id } }"
                  class="button">
                  {{ $t('misc.VIEW') }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>{{ $t('misc.EMPTY_RESULTS', { type: 'orders' }) }}</div>
    </div>
    <loading v-else/>
  </div>
</template>

<script>
import paginator from '@/shared/components/paginator'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import tableHeader from '@/shared/components/table/thead'

export default {
  components: {
    paginator,
    tableHeader,
    notFound,
    loading
  },
  props: {
    pagination: {
      type: Object,
      required: false,
      default: () => {}
    },
    tableData: {
      type: Array,
      required: false,
      default: () => []
    }
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
  }
}
</script>

<style lang="scss" scoped>

</style>
