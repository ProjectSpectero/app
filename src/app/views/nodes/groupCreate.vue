<template>
  <div>
    <top :title="$t('nodes.CREATE_GROUP')"/>
    <div class="container">
      <create-form/>
    </div>
  </div>
</template>

<script>
import createForm from '@/app/components/nodes/groupForm'
import top from '@/shared/components/top'

export default {
  components: {
    top,
    createForm
  },
  metaInfo: {
    title: 'Create Node Group'
  }
}
</script>
