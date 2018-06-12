<template>
  <button
    :class="buttonClass"
    class="button-bordered button-info"
    @click="downloadFile">
    <span class="icon-download"/> {{ $i18n.t('misc.DOWNLOAD_AS_FILE') }}
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
    }
  },
  methods: {
    downloadFile () {
      downloadjs(this.content, this.file, this.type)
    }
  }
}
</script>
