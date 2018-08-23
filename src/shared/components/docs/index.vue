<template>
  <div>
    <top :title="$t('misc.DOCUMENTATION')"/>

    <div class="container">
      <div class="col-12">
        <contents :items="helpContents"/>
      </div>
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
