<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"></div>
    <h1>Not Found</h1>
    <p>{{ msg ? msg : 'The resource you requested could not be found.' }}</p>
  </div>
</template>

<script>
export default {
  props: {
    msg: String
  }
}
</script>
