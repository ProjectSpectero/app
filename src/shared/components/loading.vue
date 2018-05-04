<template>
  <div class="alert-msg-centered">
    <div class="loader">
      <div class="bouncing-loader"><div></div><div></div><div></div></div>
      <h1>{{ $i18n.t('misc.LOADING') }}</h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: inline-block;
  padding: 16px 32px 20px 32px;
  color: $white;
  background: rgba(0,0,0,0.75);
  border-radius: 20px;
}
</style>
