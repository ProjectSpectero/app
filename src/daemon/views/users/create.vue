<template>
  <div>
    <top title="Add User">
      <button
        class="button"
        @click="askBeforeExiting">
        Cancel
      </button>
    </top>

    <user-form
      action="create"
      @canceled="askBeforeExiting"
      @success="showSuccessMessage"/>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import userForm from '@/daemon/components/users/form'

export default {
  components: {
    userForm,
    top
  },
  metaInfo: {
    title: 'Add User'
  },
  methods: {
    askBeforeExiting () {
      if (confirm(this.$t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'daemon-users' })
      }
    },
    showSuccessMessage () {
      this.$toasted.success(this.$t('daemon.USER_CREATE_SUCCESS'))
      this.$router.push({ name: 'daemon-users' })
    }
  }
}
</script>
