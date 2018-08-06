<template>
  <div>
    <daemon-menu/>

    <div class="container">
      <div class="col-12">
        <div class="section padded">
          <div class="add col-12 mb-4">
            <h2>
              {{ $i18n.t('misc.USERS') }}
            </h2>
            <button
              class="button-md button-success"
              @click.prevent="add">
              Add User
            </button>
          </div>

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
      </div>
    </div>
  </div>
</template>

<script>
import userAPI from '@/daemon/api/user'
import daemonMenu from '@/daemon/components/common/menu'
import paginator from '@/shared/components/paginator'
import tableHeader from '@/shared/components/table/thead'

export default {
  components: {
    top,
    paginator,
    daemonMenu,
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
    add () {
      this.$router.push({ name: 'daemon-user-create', params: { nodeId: this.$route.params.nodeId } })
    },
    async edit (id) {
      console.log('Editing', id)
      this.$router.push({ name: 'daemon-user-edit', params: { nodeId: this.$route.params.nodeId, id: id } })
    },
    async remove (id) {
      if (confirm(this.$i18n.t('misc.DELETE_CONFIRM_DIALOG', { object: 'user' }))) {
        await userAPI.delete({
          data: {
            id: id
          },
          success: response => {
            this.$toasted.success(this.$i18n.t('daemon.USER_DELETE_SUCCESS'))
            this.fetchUsers(this.$route.params.page || 1)
          },
          fail: error => {
            console.error(error)
            this.$toasted.error(this.$i18n.t('daemon.USER_DELETE_ERROR'))
          }
        })
      }
    },
    async certificates (id) {
      this.$router.push({ name: 'daemon-user-certificates', params: { id: id } })
    },
    async changedPage (page) {
      this.$router.push({ name: 'daemon', params: { nodeId: this.$route.params.nodeId, tabAction: 'users' } })
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
          this.$router.push({ name: 'daemon' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  display: flex;
  justify-content: space-between;
  align-items: center;

  > h2 {
    margin: 0;
  }
}
</style>
