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
                {{ $i18n.t('invoices.INVOICE_STATUS.' + row.status) }}
              </div>
            </td>
            <td>{{ row.due_date | moment('MMM D, YYYY') }}</td>
            <td>{{ row.amount | currency }} {{ row.currency }}</td>
            <td>
              <router-link class="button" :to="{ name: 'invoice', params: { id: row.id } }">
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

    <paginator :pagination="pagination" @changedPage="changedPage"></paginator>
  </div>
</template>

<script>
import paginator from '@/components/app/common/paginator'
import tableHeader from '@/components/app/common/table/thead'

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
