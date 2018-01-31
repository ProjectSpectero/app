<template>
  <div>
    <top title="Users">
      <router-link :to="{ name: 'userCreate' }" class="button button-success">
        Add User
      </router-link>
    </top>

    <div class="datatable">
      <v-client-table :data="tableData" :columns="columns" :options="options">
        <template slot="name" slot-scope="props">
          <div class="main-info">
            <div class="avatar">
              {{ parseInitials(props.row) }}
            </div>
            <div class="name">
              <h3 class="no-pad">{{ props.row.fullName || props.row.authKey }}</h3>
              <span v-if="props.row.fullName">{{ props.row.authKey }}</span>
            </div>
          </div>
        </template>

        <template slot="lastLoginDate" slot-scope="props">
          {{ props.row.lastLoginDate | moment('from') }}
        </template>

        <template slot="roles" slot-scope="props">
          {{ parseRoles(props.row.roles) }}
        </template>

        <template slot="actions" slot-scope="props">
          <dropdown>
            <template slot="btn">Manage</template>
            <template slot="icon"><span class="icon icon-chevron-down"></span></template>
            <template slot="body">
              <div class="dropdown-items">
                <span class="item" v-for="(actionButton, index) in actionButtons" :key="index" @click="triggerAction(props.row, actionButton.key)">
                  <span :class="['icon', actionButton.icon]"></span> {{ actionButton.text }}
                </span>
              </div>
            </template>
          </dropdown>
        </template>
      </v-client-table>

      <template v-if="selectedUser">
        <remove :name="modalName('delete')"></remove>
        <certificates :name="modalName('certificates')"></certificates>
      </template>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import top from '../common/top'
  import remove from './deleteModal'
  import certificates from './certificatesModal'
  import dropdown from 'bp-vuejs-dropdown'

  export default {
    data () {
      return {
        selectedUser: null,
        actionButtons: [],
        columns: [],
        options: {}
      }
    },
    created () {
      this.fetchUsers()
      this.actionButtons = [
        { key: 'edit', text: 'Edit User', icon: 'icon-edit' },
        { key: 'delete', text: 'Delete User', icon: 'icon-trash' },
        { key: 'certificates', text: 'View Certificate', icon: 'icon-award' }
      ],
      this.columns = ['name', 'lastLoginDate', 'source', 'roles', 'actions']
      this.options = {
        skin: '',
        headings: {
          name: 'User',
          lastLoginDate: 'Last Active',
          source: 'Source',
          roles: 'Roles',
          actions: 'Actions'
        },
        sortable: ['lastLoginDate', 'source', 'roles'],
        filterable: ['fullName'],
        customFilters: [],
        texts: {
          count:"Showing {from} to {to} of {count} records|{count} records|One record",
          filter: '',
          filterPlaceholder: 'Search users',
          limit: 'Records:',
          page: 'Page:',
          noResults: 'No matching records',
          filterBy: "Filter by {column}",
          loading: 'Loading...',
          defaultOption: 'Select {column}',
          columns: 'Columns'
        },
        perPage: 10
      }
    },
    computed: {
      ...mapGetters({
        tableData: 'users/list'
      })
    },
    methods: {
      ...mapActions({
        fetchUsers: 'users/fetch'
      }),
      triggerAction (user, action) {
        this.selectedUser = user

        if (action === 'edit') {
          this.$router.push({ name: 'userEdit', params: { id: user.id } })
        } else {
          Vue.nextTick().then(() => {
            this.$modal.show(this.modalName(action), { user: user })
          })
        }
      },
      modalName (modal) {
        return modal + '-' + this.selectedUser.id
      },
      parseInitials (user) {
        const displayName = user.fullName || user.authKey
        const initials = displayName.match(/\b\w/g) || []
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
      },
      parseRoles (roles) {
        return roles.join(', ')
      }
    },
    components: {
      top,
      remove,
      certificates,
      dropdown
    },
    metaInfo: {
      title: 'Users'
    }
  }
</script>

<style lang="scss" scoped>
  @import "vars/all";

  .main-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-size: 16px;
    font-weight: $font-weight-strong;
    background-color: #6B47DB;
    background-image: linear-gradient(-1deg, #6B47DB 2%, #8261E6 98%);
    border-radius: 4px;
  }
  .name {
    h3 {
      font-size: $font-size-main;
      line-height: 120%;
      font-weight: $font-weight-semi;
    }
    span {
      font-size: 12px;
      line-height: 150%;
      color: #777777;
    }
  }
</style>
