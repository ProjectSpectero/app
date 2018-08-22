<template>
  <div class="tooltip-trigger">
    <span
      v-tooltip="{ html: randomId }"
      :class="icon"/>
    <div
      :id="randomId"
      class="tooltip">
      <h4>{{ $i18n.t(`help.${id}.title`) }}</h4>
      <div
        class="description"
        v-html="$i18n.t(`help.${id}.description`)"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false,
      default: 'icon-help-circle'
    }
  },
  computed: {
    randomId () {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip-trigger {
  display: inline-block;
  font-size: 18px;
  cursor: pointer;
}
</style>
