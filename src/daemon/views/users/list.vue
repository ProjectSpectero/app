<template>
  <div>
    <daemon-menu/>

    <div class="container">
      <div class="col-12">
        <div class="section">
          <div class="add col-12 mt-4 mb-4">
            <h2>
              {{ $t('misc.USERS') }}
            </h2>
            <button
              class="button is-medium is-success"
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
                      <td>{{ row.authKey }}</td>
                      <td>{{ row.emailAddress }}</td>
                      <td>{{ parseRoles(row.roles) }}</td>
                      <td class="table-actions">
                        <template v-if="row.source === 'Local'">
                          <button
                            class="button"
                            @click.stop="remove(row.id)">
                            {{ $t('misc.REMOVE') }}
                          </button>

                          <button
                            class="button"
                            @click.stop="edit(row.id)">
                            {{ $t('misc.EDIT') }}
                          </button>

                          <button
                            class="button"
                            @click.stop="certificates(row.id)">
                            {{ $t('daemon.CERTIFICATES') }}
                          </button>

                          <button
                            class="button"
                            @click.stop="resources(row.id)">
                            {{ $t('daemon.RESOURCES') }}
                          </button>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          <loading
            v-else
            text="Fetching local users ..."/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import userAPI from '@/daemon/api/user'
import daemonMenu from '@/daemon/components/common/menu'
import tableHeader from '@/shared/components/table/thead'
import loading from '@/shared/components/loading'

export default {
  components: {
    top,
    loading,
    daemonMenu,
    tableHeader
  },
  data () {
    return {
      tableData: null,
      pagination: null,
      perPage: 10,
      columns: ['id', 'authKey', 'emailAddress', 'roles', 'actions'],
      sortable: [],
      headings: {
        id: 'ID',
        authKey: 'Username',
        emailAddress: 'Email',
        roles: 'Roles',
        actions: ''
      },
      actionButtons: null
    }
  },
  computed: {
    ...mapGetters({
      node: 'daemonAuth/node'
    })
  },
  async created () {
    if (this.node.market_model !== 'UNLISTED') {
      this.$router.push({ name: 'daemon-services', params: { nodeId: this.$route.params.nodeId } })
    }

    await this.fetchUsers(this.$route.params.page || 1)
  },
  methods: {
    ...mapActions({
      testLogin: 'daemonAuth/testLogin'
    }),
    add () {
      this.$router.push({ name: 'daemon-user-create', params: { nodeId: this.$route.params.nodeId } })
    },
    async edit (id) {
      console.log('Editing', id)
      this.$router.push({ name: 'daemon-user-edit', params: { nodeId: this.$route.params.nodeId, id: id } })
    },
    async remove (id) {
      if (confirm(this.$t('misc.DELETE_CONFIRM_DIALOG', { object: 'user' }))) {
        await this.testLogin()

        await userAPI.delete({
          data: {
            id: id
          },
          success: response => {
            this.$toasted.success(this.$t('daemon.USER_DELETE_SUCCESS'))
            this.fetchUsers(this.$route.params.page || 1)
          },
          fail: error => {
            console.error(error)
            this.$toasted.error(this.$t('daemon.USER_DELETE_ERROR'))
          }
        })
      }
    },
    async certificates (id) {
      this.$router.push({ name: 'daemon-user-certificates', params: { id: id } })
    },
    async resources (id) {
      this.$router.push({ name: 'daemon-user-resources', params: { id: id } })
    },
    async changedPage (page) {
      this.$router.push({ name: 'daemon', params: { nodeId: this.$route.params.nodeId, tabAction: 'users' } })
      await this.fetchUsers(page)
    },
    parseRoles (roles) {
      return roles.join(',')
    },
    async fetchUsers (page) {
      await this.testLogin()

      await userAPI.list({
        success: response => {
          this.tableData = response.data.result
        },
        fail: e => {
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
