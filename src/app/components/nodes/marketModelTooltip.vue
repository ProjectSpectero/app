<template>
  <div>
    <span class="icon-help-circle" v-tooltip="{ html: 'tooltip' }"></span>
    <div id="tooltip">
      <p>{{ $i18n.t(`nodes.MARKET_MODEL_TOOLTIP`) }}</p>
      <p v-for="m in models" :key="m">
        <strong>{{ $i18n.t(`nodes.MODEL.${m}`) }}</strong>:
        {{ $i18n.t(`nodes.MODEL_DESCRIPTION.${m}`) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    models: Array
  }
}
</script>
