<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.ERROR_GENERIC_ITEM_TITLE') }}</h1>

    <p>{{ $t('errors.ERROR_GENERIC_ITEM_TEXT') }}</p>
    <router-link
      :to="{ name: 'dashboard' }"
      class="button is-info">{{ $t('misc.GO_TO_DASHBOARD') }}</router-link>
  </div>
</template>
