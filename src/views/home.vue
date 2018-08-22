<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ environment }}
    <helloWorld/>
  </div>
</template>

<script>
import helloWorld from '@/components/helloWorld.vue'

export default {
  name: 'home',
  components: {
    helloWorld
  },
  computed: {
    environment () {
      return process.env
    }
  }
}
</script>
