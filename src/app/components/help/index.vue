<template>
  <div>
    <top :title="$i18n.t('misc.HELP')"></top>
    <contents :items="helpContents"></contents>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import contents from './contents'
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

</style>
