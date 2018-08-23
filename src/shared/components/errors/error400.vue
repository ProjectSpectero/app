<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.ERROR_400_ITEM_TITLE', { item: item[0].toUpperCase() + item.substring(1) }) }}</h1>
    <slot>
      <p>{{ $t('errors.ERROR_400_ITEM_TEXT', { item: item }) }}</p>
      <router-link
        :to="{ name: 'dashboard' }"
        class="button-info">{{ $t('misc.GO_TO_DASHBOARD') }}</router-link>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      required: false,
      default: 'item'
    }
  }
}
</script>
