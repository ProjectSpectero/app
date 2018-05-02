<template>
  <div class="error-screen">
    <div class="inside">
      <router-view></router-view>
    </div>
    <div class="actions">
      <router-link :to="{ name: 'dashboard' }" class="button">Go Back Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'Error'
  }
}
</script>
