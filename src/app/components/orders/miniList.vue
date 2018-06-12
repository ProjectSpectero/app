<template>
  <div>
    <div v-if="tableData">
      <div v-if="tableData.length" class="datatable">
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
      <div>{{ $i18n.t('misc.EMPTY_RESULTS', { type: 'orders' }) }}</div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import paginator from '@/shared/components/paginator'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/notFound'
import tableHeader from '@/shared/components/table/thead'

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
    tableHeader,
    notFound,
    loading
  }
}
</script>

<style lang="scss" scoped>

</style>
