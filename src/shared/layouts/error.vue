<template>
  <div class="error-screen">
    <div class="inside">
      <router-view></router-view>
    </div>
    <div class="actions">
      <router-link :to="{ name: 'dashboard' }" class="button">Back home</router-link>
    </div>
  </div>
</template>
