<template>
  <button
    v-clipboard:copy="field"
    v-clipboard:success="copyToClipboard"
    :class="buttonClass"
    class="button-bordered button-info">
    <span class="icon-copy"/> {{ $i18n.t('misc.COPY_TO_CLIPBOARD') }}
  </button>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      required: true
    },
    buttonClass: {
      type: String,
      required: true
    }
  },
  methods: {
    copyToClipboard (e) {
      this.$toasted.success(this.$i18n.t('misc.COPIED_TO_CLIPBOARD'))
    }
  }
}
</script>
