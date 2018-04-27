<template>
  <div>
    <button @click="downloadFile">
      {{ $i18n.t('misc.DOWNLOAD_AS_FILE') }}
    </button>
  </div>
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
    }
  },
  methods: {
    downloadFile () {
      downloadjs(this.content, this.file, this.type)
    }
  }
}
</script>
