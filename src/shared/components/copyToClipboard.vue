<template>
  <button v-clipboard:copy="field" v-clipboard:success="copyToClipboard" class="button button-bordered button-info" :class="buttonClass">
    <span class="icon-copy"></span> {{ $i18n.t('misc.COPY_TO_CLIPBOARD') }}
  </button>
</template>

<script>
export default {
  props: {
    field: String,
    buttonClass: String
  },
  methods: {
    copyToClipboard (e) {
      this.$toasted.success(this.$i18n.t('misc.COPIED_TO_CLIPBOARD'))
    }
  }
}
</script>
