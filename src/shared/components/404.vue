<template>
  <div>
    <h1>{{ $i18n.t('errors.ERROR_404_TITLE') }}</h1>
    <p>{{ $i18n.t('errors.ERROR_404_TEXT') }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: null
    }
  },
  created () {
    this.title = this.$i18n.t('errors.ERROR_404_META_TITLE')
  },
  metaInfo: {
    title: this.title
  }
}
</script>
