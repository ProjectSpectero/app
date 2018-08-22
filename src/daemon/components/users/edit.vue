<template>
  <div>
    <top title="Edit User">
      <button
        class="button"
        @click="askBeforeExiting">Cancel</button>
    </top>

    <user-form
      v-if="selectedUser"
      :user="selectedUser"
      action="edit"
      @canceled="askBeforeExiting"
      @success="showSuccessMessage"/>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import userForm from '@/daemon/components/users/form'
import userAPI from '@/daemon/api/user'

export default {
  components: {
    top,
    userForm
  },
  metaInfo: {
    title: 'Add User'
  },
  data () {
    return {
      selectedUser: null
    }
  },
  async created () {
    await this.fetchUser()
  },
  methods: {
    async fetchUser () {
      await userAPI.get({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.selectedUser = response.data.result
        },
        fail: error => {
          console.log(error)
          this.$toasted.error(this.errorAPI(error, 'errors'))
        }
      })
    },
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'daemon-users' })
      }
    },
    showSuccessMessage () {
      this.$toasted.success(this.$i18n.t('daemon.USER_UPDATE_SUCCESS'))
      this.$router.push({ name: 'daemon-users' })
    }
  }
}
</script>
