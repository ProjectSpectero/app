<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <helloWorld/>
  </div>
</template>

<script>
import helloWorld from '@/components/helloWorld.vue'

export default {
  name: 'home',
  components: {
    helloWorld
  }
}
</script>
