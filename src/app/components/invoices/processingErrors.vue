<template>
  <div>
    <p>{{ $i18n.t('invoices.UNABLE_TO_PROCESS') }}</p>
    <p>{{ $i18n.t('invoices.FIX_OPTIONS_TEXT') }}</p>

    <template v-if="status !== 400">
      <ul v-if="errorBag && errorBag[0]" class="error-list">
        <li v-for="(error, i) in errorBag" :key="i">
          {{ $i18n.t('misc.RESOURCE')}} #{{ error.id }}: {{ $i18n.t(`invoices.RESOURCE_ERROR.${error.reason}`) }}
        </li>
      </ul>

      <button @click="fix" class="button button-warning">{{ $i18n.t('orders.FIX')}}</button>
      <button @click="cancel" class="button button-danger button-bordered right">{{ $i18n.t('orders.CANCEL')}}</button>
    </template>
    <template v-else>
      {{ $i18n.t('invoices.RESOURCES_MISMATCH', { order: invoice.order_id }) }}
    </template>
  </div>
</template>

<script>
import orderAPI from '@/app/api/order'

export default {
  props: {
    invoice: Object,
    errorBag: Object,
    status: Number
  },
  methods: {
    async cancel () {
      await orderAPI.delete({
        data: { id: this.invoice.order_id },
        success: response => {
          this.$toasted.success(this.$i18n.t('orders.CANCEL_SUCCESS'))
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
