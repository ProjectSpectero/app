<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('orders.REGENERATE_ACCESSOR') }}</h2>
      <button @click="$modal.hide('regenerateAccessorModal')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <div v-if="!failed" class="message message-warning">{{ $i18n.t('orders.REGENERATE_ACCESSOR_WARNING') }}</div>
      <div v-else class="message message-error">{{ $i18n.t('orders.REGENERATE_ACCESSOR_ERROR') }}</div>
      <div class="action-buttons">
        <button @click="process()" :disabled="processing" class="button button-info">{{ $i18n.t('orders.REGENERATE_ACCESSOR') }}</button>
        <button @click="$modal.hide('regenerateAccessorModal')" class="button right">{{ $i18n.t('misc.NO_CANCEL') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      failed: false,
      processing: false
    }
  },
  props: {
    orderId: Number
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
          this.$toasted.success(this.$i18n.t('orders.REGENERATE_ACCESSOR_SUCCESS'))
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
