<template>
  <div :class="{ 'child': child }">
    <article
      v-for="(page, i) in items"
      :key="i"
      :class="{ 'section': !child }">
      <div
        v-if="page.title"
        class="title">
        <h2 v-if="!child">{{ page.title }}</h2>
        <h4 v-else>{{ page.title }}</h4>

        <h6 v-if="page.subtitle">{{ page.subtitle }}</h6>
      </div>

      <div class="content">
        <div
          v-if="page.description"
          class="description"
          v-html="page.description"/>

        <contents
          v-if="page.topics"
          :items="page.topics"
          :child="true"/>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Contents',
  props: {
    items: {
      type: Object,
      required: true
    },
    child: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}
h4 {
  margin-bottom: 12px;
}
.child {
  .content {
    padding: 0 !important;
  }
  .child {
    padding: 12px 20px;
    margin-top: 20px;
    margin-left: 10px;
    border-left: 1px dashed $color-border;

    h4 {
      font-size: 105%;
    }
  }
}
</style>
