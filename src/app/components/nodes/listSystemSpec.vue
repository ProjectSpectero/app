<template>
  <div class="spec">
    <template v-if="typeof spec === 'object'">
      <div
        v-for="(subspec, j) in spec"
        :key="j">
        <div class="title">{{ j }}</div>

        <div class="subspec">
          <spec :spec="subspec"/>
        </div>
      </div>
    </template>
    <template v-else>
      {{ spec }}
    </template>
  </div>
</template>

<script>
export default {
  name: 'Spec',
  props: {
    spec: {
      type: [String, Object, Boolean, Number],
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.spec {
  padding: 16px;
  margin-bottom: 0;
  border: 1px solid $color-border;

  .subspec {
    margin-bottom: 12px;
  }
}

.title {
  font-weight: $font-bold;
  margin-bottom: 8px;
}
</style>
