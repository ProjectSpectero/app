<template>
  <div class="modal">
    <div class="modal-header">
      <h2>Cancel Order</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <template v-if="enterpriseOrder">
        <div class="message message-info">{{ $t('orders.CONTACT_ACCOUNT_REPRESENTATIVE') }}</div>
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
        <p class="spaced">{{ $t('orders.DELETE_ORDER_CONFIRM_DIALOG') }}</p>
        <div>
          <button
            :class="{'is-loading': loading, 'button is-danger': !loading}"
            :disabled="loading"
            class="button"
            @click="cancel">
            Cancel Order
          </button>
          <button
            :disabled="loading"
            class="button right"
            @click="close">
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
    cancelled: {
      type: Function,
      required: false,
      default: () => {}
    },
    enterpriseOrder: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async cancel () {
      this.loading = true

      await orderAPI.delete({
        data: { id: this.id },
        success: response => {
          this.loading = false
          this.cancelled()
          this.close()
          this.$toasted.success(this.$t('orders.CANCEL_SUCCESS'))
        },
        fail: error => {
          this.loading = false
          this.$toasted.error(this.$t('orders.CANCEL_ERROR'))
          console.error(error)
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
