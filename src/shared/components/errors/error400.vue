<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"></div>
    <h1>{{ $i18n.t('errors.ERROR_400_ITEM_TITLE', { item: item[0].toUpperCase() + item.substring(1) }) }}</h1>
    <slot>
      <p>{{ $i18n.t('errors.ERROR_400_ITEM_TEXT', { item: item }) }}</p>
      <router-link :to="{ name: 'dashboard' }" class="button-info">{{ $i18n.t('misc.GO_TO_DASHBOARD') }}</router-link>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    item: String
  }
}
</script>
