<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $t('orders.REGENERATE_ACCESSOR') }}</h2>
      <button
        class="modal-close"
        @click="$modal.hide('regenerateAccessorModal')"/>
    </div>
    <div class="modal-content">
      <div
        v-if="!failed"
        class="message message-warning">{{ $t('orders.REGENERATE_ACCESSOR_WARNING') }}</div>
      <div
        v-else
        class="message message-error">{{ $t('orders.REGENERATE_ACCESSOR_ERROR') }}</div>
      <div class="action-buttons">
        <button
          :disabled="processing"
          class="button is-info"
          @click="process()">{{ $t('orders.REGENERATE_ACCESSOR') }}</button>
        <button
          class="button right"
          @click="$modal.hide('regenerateAccessorModal')">{{ $t('misc.NO_CANCEL') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'

export default {
  props: {
    orderId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      failed: false,
      processing: false
    }
  },
  methods: {
    process () {
      this.failed = false
      this.processing = true

      orderAPI.regenerateAccessor({
        data: {
          id: this.orderId
        },
        success: response => {
          this.processing = false
          this.$toasted.success(this.$t('orders.REGENERATE_ACCESSOR_SUCCESS'))
          this.$emit('fetchAccessor')
          this.$modal.hide('regenerateAccessorModal')
        },
        fail: (e) => {
          this.processing = false
          this.failed = true
          console.log(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.action-buttons {
  display: block;
  margin-top: 20px;
}
</style>
