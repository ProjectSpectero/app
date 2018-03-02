<template>
  <div class="pad-margin">{{ $i18n.t('misc.NOT_FOUND', { type: type }) }}</div>
</template>

<script>
export default {
  props: {
    type: String
  }
}
</script>
