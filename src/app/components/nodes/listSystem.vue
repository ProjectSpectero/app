<template>
  <div class="col-12">
    <div
      v-if="node.system_data"
      class="spec-list section padded">
      <h2>System</h2>
      <div
        v-for="(spec, i) in node.system_data"
        :key="i"
        class="spec">
        <h5>{{ i }}</h5>
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
  }
}
</script>

<style lang="scss" scoped>
.spec-list {
  > .spec {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px dashed $color-border;

    &:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }
  }
}
</style>
