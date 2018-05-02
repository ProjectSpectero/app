<template>
  <div>
    <top title="Edit User">
      <button @click="askBeforeExiting" class="button">Cancel</button>
    </top>

    <user-form v-if="selectedUser" action="edit" :user="selectedUser" @canceled="askBeforeExiting" @success="showSuccessMessage"></user-form>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import userForm from './form'
import userAPI from '../../api/user.js'

export default {
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
  },
  components: {
    top,
    userForm
  },
  metaInfo: {
    title: 'Add User'
  }
}
</script>
