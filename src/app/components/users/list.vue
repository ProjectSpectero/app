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
              @click.stop="triggerImpersonation(props.row.id)">
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
import { getCookie } from 'tiny-cookie'
import userAPI from '@/app/api/user'
import authAPI from '@/app/api/auth'
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
            console.log(error)
          }
        })
      }
    },
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
