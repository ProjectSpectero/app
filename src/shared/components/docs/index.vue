<template>
  <div>
    <top :title="$i18n.t('misc.DOCUMENTATION')"/>

    <div class="content">
      <contents :items="helpContents"/>
    </div>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import contents from '@/shared/components/docs/contents'
import translations from '@/shared/lang/en'

export default {
  components: {
    top,
    contents
  },
  computed: {
    helpContents () {
      return translations.help
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
