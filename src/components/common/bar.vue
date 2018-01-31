<template>
  <div class="bar">
    <component :is="barComponent"></component>
  </div>
</template>

<script>
  import restartHTTPProxy from '../services/HTTPProxy/restart'

  export default {
    props: {
      barComponent: String
    },
    components: {
      restartHTTPProxy
    }
  }
</script>

<style lang="scss" scoped>
  .bar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    text-align: center;
    padding: $pad/2;
    color: $color-smoke;
    background: $color-info;
  }
</style>

