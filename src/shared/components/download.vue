<template>
  <button @click="downloadFile" class="button button-bordered button-info" :class="buttonClass">
    <span class="icon-download"></span> {{ $i18n.t('misc.DOWNLOAD_AS_FILE') }}
  </button>
</template>

<script>
import downloadjs from 'downloadjs'

export default {
  props: {
    file: String,
    content: String,
    type: {
      type: String,
      default: 'text/plain'
    },
    buttonClass: String
  },
  methods: {
    downloadFile () {
      downloadjs(this.content, this.file, this.type)
    }
  }
}
</script>
