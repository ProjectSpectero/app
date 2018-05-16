<template>
  <div class="spec">
    <template v-if="typeof spec === 'object'">
      <div v-for="(subspec, j) in spec" :key="j">
        <div class="title">{{ j }}</div>

        <div class="subspec">
          <spec :spec="subspec"></spec>
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
    spec: [String, Object, Boolean, Number]
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: $font-bold;
  margin: 1rem 0;
}

.spec {
  padding: 1rem;
}

.subspec {
  border: 1px solid $color-border;

  .spec {
    .title {
      font-weight: 400;
    }
  }
}
</style>
