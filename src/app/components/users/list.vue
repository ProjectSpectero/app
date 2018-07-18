<template>
  <div>
    <top :title="$i18n.t('misc.USERS')"/>

    <div class="container centered">
      <div class="col-12">
        <v-client-table
          v-if="list"
          :data="list"
          :columns="columns"
          :options="options">

          <template
            slot="actions"
            slot-scope="props">
            <button
              class="button"
              @click.stop="impersonate(props.row.id)">
              {{ $i18n.t('misc.IMPERSONATE') }}
            </button>
          </template>
        </v-client-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import userAPI from '@/app/api/user'
import top from '@/shared/components/top'

export default {
  components: {
    top
  },
  data () {
    return {
      list: null,
      columns: ['id', 'name', 'email', 'status', 'created_at', 'actions'],
      options: {},
      headings: {
        name: 'Name'
      }
    }
  },
  async created () {
    await this.fetchList()

    this.options = {
      skin: '',
      texts: {
        count: 'Showing {from} to {to} of {count} users|{count} users|One user',
        filter: '',
        filterPlaceholder: 'Search users',
        limit: 'Users:',
        page: 'Page:',
        noresult: 'This item has no users yet.',
        filterBy: 'Filter by {column}',
        loading: 'Loading...',
        defaultOption: 'Select {column}',
        columns: 'Columns'
      },
      columnsClasses: {
        actions: 'table-actions'
      },
      perPage: 10,
      pagination: true,
      headings: this.headings,
      sortable: this.columns,
      filterable: this.columns
    }
  },
  methods: {
    ...mapActions({
      impersonate: 'appAuth/impersonate'
    }),
    async fetchList () {
      await userAPI.list({
        queryParams: {
          page: 1,
          perPage: 100
        },
        success: response => {
          this.list = response.data.result
        },
        fail: error => {
          console.log(error)
          this.$router.push({ name: 'settings' })
        }
      })
    }
  }
}
</script>

<style>

</style>
