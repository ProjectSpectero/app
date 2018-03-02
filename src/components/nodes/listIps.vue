<template>
  <div>
      <div v-if="ips && ips.length" class="list pad-margin">
        <v-client-table :data="ips" :columns="columns" :options="options"></v-client-table>
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
      columns: ['created_at', 'actions'],
      sortableColumns: ['created_at'],
      filterableColumns: ['created_at'],
      headings: {
        created_at: 'Creation Date',
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
