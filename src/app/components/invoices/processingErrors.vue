<template>
  <div>
    <template v-if="status !== 400">
      <button
        class="button-danger"
        @click="fix">{{ $i18n.t('orders.FIX') }}</button>
      <button
        class="button"
        @click="cancel">{{ $i18n.t('orders.CANCEL') }}</button>
    </template>
    <template v-else>
      {{ $i18n.t('invoices.RESOURCES_MISMATCH', { order: invoice.order_id }) }}
    </template>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'
import cancelOrderModal from '../orders/cancelOrderModal'

export default {
  components: {
    cancelOrderModal
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    errorBag: {
      type: Array,
      required: false,
      default: () => []
    },
    status: {
      type: Number,
      required: false,
      default: 0
    }
  },
  methods: {
    cancel () {
      this.$modal.show(cancelOrderModal, {
        id: this.invoice.order_id,
        cancelItem: () => {
          this.$router.push({ name: 'orders' })
        }
      }, {
        height: 'auto'
      })
    },
    async fix () {
      await orderAPI.fix({
        data: { id: this.invoice.order_id },
        success: response => {
          this.fixed()
          this.$toasted.success(this.$i18n.t('orders.FIX_SUCCESS'))
          this.$emit('close')
        },
        fail: e => this.$toasted.error(this.$i18n.t('orders.FIX_ERROR'))
      })
    },
    fixed () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 14px;
}
.error-list {
  margin-bottom: 14px;
}
</style>
