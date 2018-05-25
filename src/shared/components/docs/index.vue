<template>
  <div>
    <top :title="$i18n.t('misc.DOCUMENTATION')"></top>

    <div class="content">
      <contents :items="helpContents"></contents>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import contents from '@/shared/components/docs/contents'
import translations from '@/shared/lang/en'

export default {
  computed: {
    helpContents () {
      return translations.help
    }
  },
  components: {
    top,
    contents
  }
}
</script>

<style lang="scss" scoped>
  .content {
    padding: 0 1rem;
  }
</style>
