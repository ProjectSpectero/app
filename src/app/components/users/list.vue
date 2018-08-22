<template>
  <div>
    <top :title="$i18n.t('misc.USERS')"/>

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
                <td>{{ row.name }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.status }}</td>
                <td>{{ row.created_at | moment('MMM D, YYYY') }}</td>
                <td class="table-actions">
                  <button
                    class="button"
                    @click.stop="triggerImpersonation(row.id)">
                    {{ $i18n.t('misc.IMPERSONATE') }}
                  </button>
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
import { mapActions } from 'vuex'
import { getCookie } from 'tiny-cookie'
import userAPI from '@/app/api/user'
import authAPI from '@/app/api/auth'
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
      columns: ['id', 'name', 'email', 'status', 'created_at', 'actions'],
      sortable: [],
      headings: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        status: 'Status',
        created_at: 'Created at',
        actions: ''
      }
    }
  },
  async created () {
    await this.fetchUsers(this.$route.params.page || 1)
  },
  methods: {
    ...mapActions({
      addCookie: 'appAuth/addCookie',
      setLoginInfo: 'appAuth/setLoginInfo',
      syncImpersonatedUser: 'appAuth/syncImpersonatedUser',
      startImpersonating: 'appAuth/startImpersonating'
    }),
    async triggerImpersonation (id) {
      const loginCookie = getCookie(process.env.APP_COOKIE)

      if (loginCookie) {
        let realCookie = JSON.parse(loginCookie)
        realCookie.cookieName = process.env.IMPERSONATE_COOKIE

        await authAPI.impersonate({
          data: { id: id },
          success: async response => {
            const impersonationData = response.data.result

            // Store the "real" login information in process.env.IMPERSONATE_COOKIE
            // so we can switch back to it later
            this.addCookie(Object.assign({}, realCookie, { cookieName: process.env.IMPERSONATE_COOKIE }))

            // Set our current login information as if we were the target user:
            // First we add the new info to process.env.APP_COOKIE,
            // then we clear all user data from the store,
            // then we act as if we had just logged in with the "fake" user
            this.addCookie(impersonationData)
            this.setLoginInfo(impersonationData)
            await this.syncImpersonatedUser(id)
            this.startImpersonating()

            this.$router.push({ name: 'nodes' })
          },
          fail: error => {
            console.error(error)
          }
        })
      }
    },
    async changedPage (page) {
      this.$router.push({ name: 'users-list', params: { page: page } })
      await this.fetchUsers(page)
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
          this.$router.push({ name: 'settings' })
        }
      })
    }
  }
}
</script>
