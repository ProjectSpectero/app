<template>
  <modal :name="name" :adaptive="true" height="auto" width="500px" :scrollable="true" @before-open="beforeOpen">
    <div class="modal-title">
      <h2>Delete User</h2>
      <button class="modal-close" @click.prevent="closeModal"></button>
    </div>
    <div class="pad">
      <div v-if="isCurrentUser">
        <form>
          <div class="message error">{{ $t('errors.CANNOT_DELETE_SELF') }}</div>
          <button class="button" @click.prevent="closeModal">Close</button>
        </form>
      </div>
      <div v-else>
        <p>Are you sure you want to delete <strong>{{ username }}</strong>?</p>
        <p><strong>WARNING:</strong> This action cannot be undone.</p>
        <form class="delete-form">
          <div class="message error" v-if="formError">{{ formError }}</div>
          <input type="text" v-model="confirmDelete" placeholder="Type 'DELETE' to proceed" class="input input-confirm">
          <button class="button button-danger" @click.prevent="submit" @keyup.enter="submit" :disabled="isDisabled">
            {{ formDisable ? 'Please Wait' : 'Delete User' }}
          </button>
          <button class="button right" @click.prevent="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import user from '../../api/user.js'

  export default {
    props: {
      name: String
    },
    data () {
      return {
        user: {},
        formError: null,
        formDisable: false,
        confirmDelete: ''
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/currentUser'
      }),
      username () {
        return this.user !== null ? this.user.authKey : null
      },
      isCurrentUser () {
        return this.user.id === this.currentUser.id
      },
      isDisabled () {
        return this.formDisable || this.confirmDelete.toLowerCase() !== 'delete'
      }
    },
    methods: {
      ...mapActions({
        fetchUsers: 'users/fetch'
      }),
      beforeOpen (event) {
        this.reset()
        this.user = event.params.user
      },
      submit () {
        this.formDisable = true

        user.delete({
          data: {
            id: this.user.id
          },
          success: response => {
            this.formError = null
            this.fetchUsers()
            this.$modal.hide(this.name)
            this.$toasted.show(this.$i18n.t('USER_DELETE_SUCCESS'))
            this.reset()
          },
          fail: error => {
            this.$modal.hide(this.name)
            this.$toasted.error(this.$i18n.t('USER_DELETE_ERROR'))
            this.formError = error.data.errors[0]
            this.formDisable = false
          }
        })
      },
      closeModal () {
        this.$modal.hide(this.name)
      },
      reset () {
        Object.assign(this.$data, this.$options.data.call(this))
      }
    }
  }
</script>

<style lang="scss">
  .delete-form {
    padding-top: 16px;
  }
  .input-confirm {
    margin-bottom: 20px;
  }
</style>