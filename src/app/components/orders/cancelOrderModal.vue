<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Cancel Order</h2>
      <button @click="$emit('close')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <p class="spaced">{{ $i18n.t('orders.DELETE_ORDER_CONFIRM_DIALOG') }}</p>
      <div>
        <button @click="cancel()" class="button" :class="{'button-loading': loading, 'button-danger': !loading}" :disabled="loading">
          Cancel Order
        </button>
        <button @click="$emit('close')" class="button right" :disabled="loading">
          No, Nevermind
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'

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

      orderAPI.delete({
        data: { id: this.id },
        success: response => {
          this.cancelItem()
          this.$emit('close')
          this.$toasted.success(this.$i18n.t('orders.CANCEL_SUCCESS'))
        },
        fail: error => {
          this.loading = false
          this.$toasted.error(this.$i18n.t('orders.CANCEL_ERROR'))
          console.error(error)
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
