<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Cancel Engagement</h2>
      <button @click="$emit('close')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <p class="spaced">{{ $i18n.t('nodes.DELETE_ENGAGEMENT_CONFIRM_DIALOG') }}</p>
      <div>
        <button @click="cancel()" class="button" :class="{'button-loading': loading, 'button-danger': !loading}" :disabled="loading">
          Cancel Engagement
        </button>
        <button @click="$emit('close')" class="button right" :disabled="loading">
          No, Nevermind
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'

export default {
  props: {
    id: Number,
    cancelItem: Function
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    cancel () {
      this.loading = true

      nodeAPI.deleteEngagement({
        data: { id: this.id },
        success: response => {
          this.cancelItem()
          this.$emit('close')
          this.$toasted.success(this.$i18n.t('nodes.ENGAGEMENT_DELETE_SUCCESS'))
        },
        fail: error => {
          this.loading = false
          this.$toasted.error(this.errorAPI(error, 'nodes'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }
}
</style>
