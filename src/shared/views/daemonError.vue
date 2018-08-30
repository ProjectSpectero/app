<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.DAEMON_ERROR_TITLE') }}</h1>

    <p>{{ $t('errors.DAEMON_ERROR_TEXT') }}</p>
    <router-link
      :to="{ name: 'nodes' }"
      class="button-info">{{ $t('misc.GO_TO_NODES_LIST') }}</router-link>
  </div>
</template>
