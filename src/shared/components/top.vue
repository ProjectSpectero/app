<template>
  <div class="top">
    <header>
      <div class="title">
        <h1 class="mb-0">{{ title }}</h1>
        <h2 class="mb-0" v-if="subtitle">{{ subtitle }}</h2>
      </div>
      <div class="button-slot">
        <slot></slot>
      </div>
    </header>
    <slot name="sub"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String
  }
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  margin-bottom: $pad;
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: 0px 0px 5px 0px rgba(33, 41, 56, 0.15);

  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 80px;
    padding: $pad;
  }
  .sub {
    margin: 0 $pad;
    padding: 16px 0;
    border-top: 1px solid $color-border;
  }

  .title {
    flex: 1;
  }
  .button-slot {
    display: flex;

    .button, .bp-dropdown {
      margin-left: 6px;
    }
  }

  h2 {
    margin-top: 6px;
    font-size: 100%;
    color: $color-light;
  }
}
</style>
