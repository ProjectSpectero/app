<template>
  <div v-if="tableData">
    <div class="datatable">
      <table>
        <table-header
          :columns="columns"
          :headings="headings"
          :sortable="sortable"
          @sortByColumn="sortByColumn"/>
        <tbody>
          <tr
            v-for="row in tableData"
            :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <div :class="'badge-' + row.status.toLowerCase()">
                {{ $i18n.t('orders.ORDER_STATUS.' + row.status) }}
              </div>
            </td>
            <td>{{ row.created_at | moment('MMM D, YYYY') }}</td>
            <td>{{ row.due_next | moment('MMM D, YYYY') }}</td>
            <td>{{ row.last_invoice.amount | currency }} {{ row.last_invoice.currency }}</td>
            <td class="table-actions">
              <template v-if="row.status !== 'CANCELLED'">
                <router-link
                  v-if="row.status !== 'CANCELLED' && row.last_invoice && row.last_invoice.status === 'UNPAID'"
                  :to="{ name: 'invoice', params: { id: row.last_invoice.id } }"
                  class="button-success">
                  {{ $i18n.t('misc.PAY_NOW') }}
                </router-link>
              </template>

              <router-link
                :to="{ name: 'order', params: { id: row.id } }"
                class="button-info">
                {{ $i18n.t('misc.VIEW') }}
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <paginator
      :pagination="pagination"
      @changedPage="changedPage"/>
  </div>
</template>

<script>
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  components: {
    paginator,
    tableHeader
  },
  props: {
    searchId: {
      type: String,
      default: null
    },
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
  }
}
</script>

<style lang="scss" scoped>

</style>
