<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('misc.NOT_FOUND_TITLE') }}</h1>
    <slot>
      <p>{{ type ? $t('misc.NOT_FOUND', { type: type }) : $t('misc.NOT_FOUND_DEFAULT') }}</p>
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
