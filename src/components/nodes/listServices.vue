<template>
  <div>
      <div v-if="services && services.length" class="list pad-margin">
        <v-client-table :data="services" :columns="columns" :options="options"></v-client-table>
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
