<template>
  <div>
    Redirecting ...
  </div>
</template>

<script>
export default {
  created () {
    this.$router.push({ name: 'daemon-services' })
  }
}
</script>
