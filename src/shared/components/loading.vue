<template>
  <div class="alert-msg-centered">
    <div class="loader">
      <div class="spinning-loader"><div/><div/><div/></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: inline-block;
  padding: 30px;
  color: $color-primary;
  background: rgba(255,255,255,0.9);
  border-radius: 8px;
  border: 1px solid $color-border;

  h1 {
    margin-bottom: 0;
    font-weight: $font-semi;
  }
}
</style>
