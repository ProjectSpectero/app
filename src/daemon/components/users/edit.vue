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
import userForm from './form'
import userAPI from '../../api/user.js'

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
  created () {
    userAPI.get({
      data: {
        id: this.$route.params.id
      },
      success: response => {
        this.selectedUser = response.data.result
      },
      fail: error => {
        console.log(error)
        this.$router.push({ name: 'error404' })
      }
    })
  },
  methods: {
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'users' })
      }
    },
    showSuccessMessage () {
      this.$toasted.show(this.$i18n.t('USER_UPDATE_SUCCESS'))
    }
  }
}
</script>
