<template>
  <button
    :class="buttonClass"
    class="is-outlined button is-info"
    @click="downloadFile">
    <span class="icon-download"/> {{ buttonText }}
  </button>
</template>

<script>
import downloadjs from 'downloadjs'

export default {
  props: {
    file: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'text/plain'
    },
    buttonClass: {
      type: String,
      required: false,
      default: ''
    },
    buttonText: {
      type: String,
      required: false,
      default: 'Download File'
    }
  },
  methods: {
    downloadFile () {
      downloadjs(this.content, this.file, this.type)
    }
  }
}
</script>
