<template>
  <div>
      <div v-if="orders && orders.length" class="list pad-margin">
        <v-client-table :data="orders" :columns="columns" :options="options">
          <template slot="due_next" slot-scope="props">
            {{ props.row.due_next | moment('MMM D, YYYY') }}
          </template>
          <template slot="updated_at" slot-scope="props">
            {{ props.row.updated_at | moment('MMM D, YYYY HH:mm:ss') }}
          </template>
          <template slot="actions" slot-scope="props">
            <router-link class="button" :to="{ name: 'invoice', params: { id: props.row.last_invoice_id } }">
              View Last Invoice
            </router-link>
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="orders"></not-found>
  </div>
</template>

<script>
import notFound from '@/components/common/notFound'

export default {
  props: {
    orders: Array
  },
  data () {
    return {
      columns: ['id', 'status', 'due_next', 'updated_at', 'actions'],
      sortableColumns: ['id', 'status', 'due_next', 'updated_at'],
      filterableColumns: ['id', 'status', 'due_next', 'updated_at'],
      headings: {
        id: 'ID',
        status: 'Status',
        due_next: 'Due date',
        updated_at: 'Last Update',
        actions: 'Actions'
      },
      options: {}
    }
  },
  components: {
    notFound
  }
}
</script>
