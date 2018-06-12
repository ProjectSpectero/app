<template>
  <div>
    <top :title="$i18n.t('nodes.CREATE_GROUP')"></top>
    <div class="container">
      <create-form></create-form>
    </div>
  </div>
</template>

<script>
import createForm from './groupForm'
import top from '@/shared/components/top'

export default {
  metaInfo: {
    title: 'Create Node Group'
  },
  components: {
    top,
    createForm
  }
}
</script>
