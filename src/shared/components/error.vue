<template>
  <div class="alert-msg-centered">
    <div class="icon-alert-circle big-icon"/>
    <h1>{{ header }}</h1>
    <p>{{ msg }}</p>
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
