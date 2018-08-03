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
                {{ $i18n.t('invoices.INVOICE_STATUS.' + row.status) }}
              </div>
            </td>
            <td>{{ row.due_date | moment('MMM D, YYYY') }}</td>
            <td>{{ row.amount | currency }} {{ row.currency }}</td>
            <td class="table-actions">
              <router-link
                v-if="row.status === 'UNPAID'"
                :to="{ name: 'checkout', params: { id: row.id } }"
                class="button-success">
                {{ $i18n.t('misc.PAY_NOW') }}
              </router-link>

              <router-link
                :to="{ name: 'invoice', params: { id: row.id } }"
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
      required: false,
      default: ''
    },
    pagination: {
      type: Object,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columns: ['id', 'status', 'due_date', 'amount', 'actions'],
      sortable: ['id', 'amount', 'status', 'due_date'],
      headings: {
        id: 'Invoice ID',
        status: 'Status',
        amount: 'Amount',
        due_date: 'Due Date',
        actions: ''
      }
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
