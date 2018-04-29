<template>
  <button v-clipboard:copy="field" v-clipboard:success="copyToClipboard">
    {{ $i18n.t('misc.COPY_TO_CLIPBOARD') }}
  </button>
</template>

<script>
export default {
  props: {
    field: String
  },
  methods: {
    copyToClipboard (e) {
      this.$toasted.success(this.$i18n.t('misc.COPIED_TO_CLIPBOARD'))
    }
  }
}
</script>
