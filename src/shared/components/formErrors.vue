<template>
  <ul
    v-if="formErrors && formErrors.length"
    class="mb-3">
    <li
      v-for="(error, i) in formErrors"
      :key="i">
      <strong>{{ error.key }}</strong>: {{ error.text }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    formErrors: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
ul > li {
  list-style: outside none;
  color: $color-danger;
}
</style>
