<template>
  <div class="home">
    {{ environment }}
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    environment () {
      return process.env
    }
  }
}
</script>
