<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Cancel Engagement</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <p class="spaced">{{ $t('nodes.DELETE_ENGAGEMENT_CONFIRM_DIALOG') }}</p>
      <div>
        <button
          :class="{'button-loading': loading, 'button-danger': !loading}"
          :disabled="loading"
          class="button"
          @click="cancel()">
          Cancel Engagement
        </button>
        <button
          :disabled="loading"
          class="button right"
          @click="$emit('close')">
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
    id: {
      type: Number,
      required: true
    },
    cancelItem: {
      type: Function,
      required: false,
      default: () => {}
    }
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
          this.$toasted.success(this.$t('nodes.ENGAGEMENT_DELETE_SUCCESS'))
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

</style>
