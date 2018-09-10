<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.ERROR_400_MODAL_TITLE') }}</h1>

    <template v-if="errorKeys && errorKeys.length">
      <p>{{ $t(`errors.${errorKeys[0]}`) }}</p>
    </template>
    <template v-else>
      <p>{{ $t('errors.ERROR_400_MODAL_TEXT') }}</p>
    </template>

    <button @click="$emit('close')">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    errorKeys: {
      type: Object,
      required: false
    }
  }
}
</script>
