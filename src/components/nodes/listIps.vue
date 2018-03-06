<template>
  <div>
      <div v-if="ips && ips.length" class="list pad-margin">
        <v-client-table :data="ips" :columns="columns" :options="options">
          <template slot="created_at" slot-scope="props">
            {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="ips"></not-found>
  </div>
</template>

<script>
import notFound from '@/components/common/notFound'

export default {
  props: {
    ips: Array
  },
  data () {
    return {
      columns: ['ip', 'created_at'],
      sortableColumns: ['ip', 'created_at'],
      filterableColumns: ['ip', 'created_at'],
      headings: {
        ip: 'IP Address',
        created_at: 'Created at'
      },
      options: {}
    }
  },
  components: {
    notFound
  }
}
</script>
