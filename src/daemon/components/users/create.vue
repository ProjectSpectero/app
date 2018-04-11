<template>
  <div>
    <top title="Add User">
      <button @click="askBeforeExiting" class="button">Cancel</button>
    </top>
    <user-form action="create" @canceled="askBeforeExiting" @success="showSuccessMessage"></user-form>
  </div>
</template>

<script>
import Top from '@/shared/components/top'
import userForm from './form'

export default {
  methods: {
    askBeforeExiting () {
      if (confirm(this.$i18n.t('LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'users' })
      }
    },
    showSuccessMessage () {
      this.$toasted.show(this.$i18n.t('USER_CREATE_SUCCESS'))
    }
  },
  components: {
    Top,
    userForm
  },
  metaInfo: {
    title: 'Add User'
  }
}
</script>
