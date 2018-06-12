<template>
  <div class="top">
    <header>
      <div class="title">
        <h1 class="mb-0">{{ title }}</h1>
        <h2
          v-if="subtitle"
          class="mb-0">{{ subtitle }}</h2>
      </div>
      <div class="slot-button">
        <slot/>
      </div>
    </header>
    <slot name="sub"/>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
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
  .slot-button {
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
