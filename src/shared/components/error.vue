<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"></div>
    <h1>{{ header ? header : 'Uh oh' }}</h1>
    <p>{{ msg ? msg : 'An unknown error occurred.' }}</p>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    msg: String
  }
}
</script>
