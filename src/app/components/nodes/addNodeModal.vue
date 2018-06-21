<template>
  <div class="modal">
    <div class="modal-header">
      <h2>{{ $i18n.t('nodes.ADD_NODE') }}</h2>
      <button
        class="modal-close"
        @click="$emit('close')"/>
    </div>
    <div class="modal-content">
      <p class="spaced">In order to add a node you must first download the Spectero CLI client. For instructions on how to do this, click the download instructions button below.</p>
      <p class="spaced">After your install and activate Spectero CLI with your node key (provided on the download instructions page) your node will appear on this page.</p>
      <div>
        <button
          class="button-info"
          @click.prevent="openDownloads()">
          Download Instructions
        </button>
        <button
          class="button right"
          @click="$emit('close')">
          Close This Window
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openDownloads () {
      // Had to make this a method because calling $emit('close') on a
      // <router-link/> doesn't appear to be possible.
      this.$emit('close')
      this.$router.push({ name: 'downloads' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
