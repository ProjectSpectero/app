<template>
  <div class="tooltip-trigger">
    <span :class="icon" v-tooltip="{ html: randomId }"></span>
    <div class="tooltip" :id="randomId">
      <h4>{{ $i18n.t(`help.${this.id}.title`) }}</h4>
      <div class="description" v-html="$i18n.t(`help.${this.id}.description`)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    icon: {
      default: 'icon-help-circle',
      required: false
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
