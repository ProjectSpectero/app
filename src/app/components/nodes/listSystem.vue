<template>
  <div>
    <div v-if="system">
      <div v-for="(spec, i) in system" :key="i" class="spec">
        <list-system-spec :spec="spec"></list-system-spec>
      </div>
    </div>
    <not-found v-else :msg="$i18n.t('misc.NOT_FOUND', { type: 'system data' })"></not-found>
  </div>
</template>

<script>
import listSystemSpec from './listSystemSpec'
import notFound from '@/shared/components/notFound'

export default {
  name: 'ListSystem',
  props: {
    node: Object
  },
  computed: {
    system () {
      if (this.node.system_data) {
        return JSON.parse(this.node.system_data)
      }
    }
  },
  components: {
    listSystemSpec,
    notFound
  }
}
</script>
