<template>
  <div class="col-12">
    <div
      v-if="system"
      class="spec-list section padded">
      <div
        v-for="(spec, i) in system"
        :key="i"
        class="spec">
        <list-system-spec :spec="spec"/>
      </div>
    </div>
    <not-found
      v-else
      type="system data"/>
  </div>
</template>

<script>
import listSystemSpec from './listSystemSpec'
import notFound from '@/shared/components/notFound'

export default {
  name: 'ListSystem',
  components: {
    listSystemSpec,
    notFound
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  computed: {
    system () {
      if (this.node.system_data) {
        return JSON.parse(this.node.system_data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.spec-list {
  > .spec {
    margin-bottom: $pad;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
