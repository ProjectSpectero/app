<template>
  <div class="spec">
    <template v-if="typeof spec === 'object'">
      <div
        v-for="(subspec, j) in spec"
        :key="j">
        <div class="subspec">
          <span class="title">{{ j }}</span>
          <spec :spec="subspec"/>
        </div>
      </div>
    </template>
    <template v-else>
      {{ spec ? spec : 'N/A' }}
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
  font-family: monospace;

  .title {
    width: 100px;
    margin-right: 12px;
    font-weight: $font-bold;
  }
  .subspec {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid $color-border;
    text-transform: capitalize;

    .spec {
      flex: 1;
    }
    > .spec .title {
      font-weight: $font-semi;
      opacity: 0.75;
    }
    &:after {
      content: "";
      display: table;
      clear: both;
    }
  }
}
</style>
