<template>
  <button
    :class="buttonClass"
    class="button"
    @click="print">
    <span class="icon-printer"/>{{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    buttonClass: {
      type: String,
      required: false,
      default: ''
    },
    buttonText: {
      type: String,
      required: false,
      default: 'Print'
    }
  },
  methods: {
    print () {
      window.print()
    }
  }
}
</script>
