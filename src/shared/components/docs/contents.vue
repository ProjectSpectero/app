<template>
  <div :class="{ 'container': !child, 'child': child }">
    <article v-for="(page, i) in items" :key="i" :class="{ 'section': !child }">
      <div v-if="page.title" class="title">
        <h2 v-if="!child">{{ page.title }}</h2>
        <h4 v-else>{{ page.title }}</h4>

        <h6 v-if="page.subtitle">{{ page.subtitle }}</h6>
      </div>

      <div class="content">
        <div v-if="page.description" v-html="page.description" class="description"></div>

        <contents v-if="page.topics" :items="page.topics" :child="true"></contents>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'contents',
  props: {
    items: Object,
    child: Boolean
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
