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
          Resource #{{ error.id }}: {{ $i18n.t(`invoices.RESOURCE_ERROR.${error.reason}`) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invoice: Object,
    errorBag: Object
  }
}
</script>
