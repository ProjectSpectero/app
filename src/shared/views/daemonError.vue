<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ $t('errors.DAEMON_ERROR_TITLE') }}</h1>

    <div class="my-5">
      <p>{{ $t('errors.DAEMON_ERROR_TEXT') }}</p>
      <p>{{ $t('errors.DAEMON_ERROR_TEXT2') }}</p>
    </div>

    <router-link
      :to="{ name: 'nodes' }"
      class="button-info">{{ $t('misc.GO_TO_NODES_LIST') }}</router-link>
  </div>
</template>
