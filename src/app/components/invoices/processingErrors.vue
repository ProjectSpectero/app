<template>
  <div>
    <p>{{ $i18n.t('invoices.FIX_ORDER_TEXT') }}</p>
    <template v-if="status !== 400">
      <button @click="fix" class="button-danger">{{ $i18n.t('orders.FIX')}}</button>
      <button @click="cancel" class="button">{{ $i18n.t('orders.CANCEL')}}</button>
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
  props: {
    invoice: Object,
    errorBag: Array,
    status: Number
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
  },
  components: {
    cancelOrderModal
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
