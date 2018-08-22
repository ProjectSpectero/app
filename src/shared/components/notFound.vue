<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $i18n.t('misc.NOT_FOUND_TITLE') }}</h1>
    <slot>
      <p>{{ type ? $i18n.t('misc.NOT_FOUND', { type: type }) : $i18n.t('misc.NOT_FOUND_DEFAULT') }}</p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'item'
    }
  }
}
</script>
