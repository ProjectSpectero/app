<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"></div>
    <h1>{{ $i18n.t('errors.ERROR_404_ITEM_TITLE', { item: item[0].toUpperCase() + item.substring(1) }) }}</h1>
    <p>{{ $i18n.t('errors.ERROR_404_ITEM_TEXT', { item: item }) }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: String
  }
}
</script>
