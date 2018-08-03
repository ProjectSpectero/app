<template>
  <div>
    <template v-if="tableData">
      <div class="container">
        <div class="col-12 datatable">
          <table>
            <table-header
              :columns="columns"
              :headings="headings"
              :sortable="sortable"/>
            <tbody>
              <tr
                v-for="row in tableData"
                :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.fullName }}</td>
                <td>{{ row.emailAddress }}</td>
                <td>{{ parseRoles(row.roles) }}</td>
                <td>{{ row.lastLoginDate | moment('MMM D, YYYY') }}</td>
                <td class="table-actions">
                  <template v-if="row.source === 'Local'">
                    <button
                      class="button"
                      @click.stop="remove(row.id)">
                      {{ $i18n.t('misc.REMOVE') }}
                    </button>

                    <button
                      class="button"
                      @click.stop="edit(row.id)">
                      {{ $i18n.t('misc.EDIT') }}
                    </button>

                    <button
                      class="button"
                      @click.stop="certificates(row.id)">
                      {{ $i18n.t('daemon.CERTIFICATES') }}
                    </button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <paginator
        :pagination="pagination"
        @changedPage="changedPage"/>
    </template>
  </div>
</template>

<script>
import userAPI from '@/daemon/api/user'
import top from '@/shared/components/top'
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  components: {
    top,
    paginator,
    tableHeader
  },
  data () {
    return {
      tableData: null,
      pagination: null,
      perPage: 10,
      columns: ['id', 'fullName', 'emailAddress', 'roles', 'lastLoginDate', 'actions'],
      sortable: [],
      headings: {
        id: 'ID',
        fullName: 'Name',
        emailAddress: 'Email',
        roles: 'Roles',
        lastLoginDate: 'Last login',
        actions: ''
      },
      actionButtons: null
    }
  },
  async created () {
    await this.fetchUsers(this.$route.params.page || 1)
  },
  methods: {
    async edit (id) {
    },
    async remove (id) {
    },
    async certificates (id) {
    },
    async changedPage (page) {
      this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, tabAction: 'users' } })
      await this.fetchUsers(page)
    },
    parseRoles (roles) {
      return roles.join(', ')
    },
    async fetchUsers (page) {
      await userAPI.list({
        queryParams: {
          page: page || 1,
          perPage: this.perPage || 10
        },
        success: response => {
          this.pagination = response.data.pagination
          this.tableData = response.data.result
        },
        fail: e => {
          console.error(e)
          this.$router.push({ name: 'manage' })
        }
      })
    }
  }
}
</script>
