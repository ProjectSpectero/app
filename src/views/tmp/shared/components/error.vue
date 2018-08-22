<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1 v-html="header" />
    <p v-html="msg" />
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: false,
      default: 'Uh oh'
    },
    msg: {
      type: String,
      required: false,
      default: 'An unknown error occurred.'
    }
  }
}
</script>
