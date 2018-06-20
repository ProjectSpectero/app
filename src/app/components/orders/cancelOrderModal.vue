<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Cancel Order</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <template v-if="isEnterpriseOrder">
        <div class="message message-info">{{ $i18n.t('orders.CONTACT_ACCOUNT_REPRESENTATIVE') }}</div>
        <div>
          <button
            :disabled="loading"
            class="button"
            @click="$emit('close')">
            Continue
          </button>
        </div>
      </template>
      <template v-else>
        <p class="spaced">{{ $i18n.t('orders.DELETE_ORDER_CONFIRM_DIALOG') }}</p>
        <div>
          <button
            :class="{'button-loading': loading, 'button-danger': !loading}"
            :disabled="loading"
            class="button"
            @click="cancel()">
            Cancel Order
          </button>
          <button
            :disabled="loading"
            class="button right"
            @click="$emit('close')">
            No, Nevermind
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'
import orderMixin from '@/app/mixins/order'

export default {
  mixins: [
    orderMixin
  ],
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

</style>
