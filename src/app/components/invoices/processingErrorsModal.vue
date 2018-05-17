<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('invoices.PAY_INVOICE') }}</h2>
      <button @click="$emit('close')" class="modal-close"></button>
    </div>
    <div class="modal-content">
      <p>{{ $i18n.t('invoices.UNABLE_TO_PROCESS') }}</p>

      <ul>
        <li v-for="(error, i) in errorBag" :key="i">
          {{ $i18n.t('misc.RESOURCE')}} #{{ error.id }}: {{ $i18n.t(`invoices.RESOURCE_ERROR.${error.reason}`) }}
        </li>
      </ul>

      <button @click="fix">{{ $i18n.t('orders.FIX')}}</button>
      <button @click="cancel">{{ $i18n.t('orders.CANCEL')}}</button>
    </div>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'

export default {
  props: {
    invoice: Object,
    errorBag: Object
  },
  methods: {
    async cancel () {
      await orderAPI.delete({
        data: { id: this.invoice.order_id },
        success: response => {
          this.$toasted.success(this.$i18n.t('orders.CANCEL_SUCCESS'))
          this.$emit('close')
          this.$router.push({ name: 'orders' })
        },
        fail: e => {
          console.log(e)
          this.$toasted.error(this.$i18n.t('orders.CANCEL_ERROR'))
        }
      })
    },
    async fix () {
      await orderAPI.fix({
        data: { id: this.invoice.order_id },
        success: response => {
          this.fixed()
          this.$emit('close')
          this.$toasted.success(this.$i18n.t('orders.FIX_SUCCESS'))
        },
        fail: e => this.$toasted.error(this.$i18n.t('orders.FIX_ERROR'))
      })
    }
  }
}
</script>
