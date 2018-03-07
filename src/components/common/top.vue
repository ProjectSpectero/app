<template>
  <div class="top">
    <h1 class="no-pad">{{ title }}</h1>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  height: 38px + $pad; // Matches button height + padding
  padding-bottom: $pad;
  margin-bottom: $pad;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $color-border;

  h1 {
    margin-bottom: 0;
    font-size: 26px;
    font-weight: $font-semi;
    line-height: 100%;
  }
  .button {
    margin-left: 4px;
  }
}
</style>
