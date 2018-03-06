<template>
  <div>
      <div v-if="services && services.length" class="list pad-margin">
        <v-client-table :data="services" :columns="columns" :options="options">
          <template slot="created_at" slot-scope="props">
            {{ props.row.created_at | moment('MMM D, YYYY HH:mm:ss') }}
          </template>
        </v-client-table>
      </div>
      <not-found v-else type="services"></not-found>
  </div>
</template>

<script>
import notFound from '@/components/common/notFound'

export default {
  props: {
    services: Array
  },
  data () {
    return {
      columns: ['config', 'connection_resource', 'type', 'created_at'],
      sortableColumns: ['config', 'connection_resource', 'type', 'created_at'],
      filterableColumns: ['config', 'connection_resource', 'type', 'created_at'],
      headings: {
        config: 'Configuration',
        connection_resource: 'Connection',
        type: 'Type',
        created_at: 'Creation Date'
      },
      options: {}
    }
  },
  components: {
    notFound
  }
}
</script>
