<template>
  <div class="tooltip-trigger" @click.stop="toggle">
    <span class="icon-help-circle"></span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    obj: String
  },
  async created () {
    await this.setContentsKey(this.obj)
  },
  methods: {
    ...mapActions({
      setContentsKey: 'help/setContentsKey',
      togglePanel: 'help/togglePanel'
    }),
    toggle () {
      this.togglePanel()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tooltip-trigger {
    display: inline-block;
    margin-left: 0;
    font-size: 24px;
    cursor: pointer;
  }
</style>
