<template>
  <div class="welcome">
    <div class="icon-welcome"><span class="icon-inbox" /></div>
    <h2>{{ $t('welcome.TITLE') }}</h2>
    <p>{{ $t('welcome.TEXT_THANK_YOU') }}</p>
    <p>{{ $t('welcome.TEXT_BODY') }}</p>
    <router-link
      :to="{ name: 'login' }"
      class="button is-info">{{ $t('welcome.BACK_TO_LOGIN') }}</router-link>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Please verify your email'
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  text-align: center;

  p {
    margin-bottom: 12px;
  }
}
.icon-welcome {
  margin-bottom: $pad;
  font-size: 72px;
  opacity: 0.2;
}
</style>
