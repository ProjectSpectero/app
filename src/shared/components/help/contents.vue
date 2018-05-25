<template>
  <section>
    <div v-for="(page, i) in items" :key="i" class="item">
      <div class="title">
        <template v-if="page.title">{{ page.title }}</template>
        <template v-else>{{ i }}</template>
      </div>

      <contents v-if="page.topics" :items="page.topics"></contents>

      <div v-else class="description">
        <div v-if="page.description" v-html="page.description"></div>
        <template v-else>-</template>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'contents',
  props: {
    items: Object
  }
}
</script>

<style lang="scss" scoped>
  .item {
    .title {
      font-size: 1.25rem;
      line-height: 1.25rem;
      margin: 1rem 0;
    }

    .item {
      background: $white;
      border: 1px solid $color-border;
      margin: 0 0 1rem 0;
      padding: 1rem;

      .title {
        font-size: 1.1rem;
        line-height: 1.1rem;
        margin: 0 0 1rem 0;
      }

      .item {
        border: 0;
        margin: 0 0 2rem;
        padding: 0;

        .title {
          font-size: 1rem;
          line-height: 1rem;
          text-decoration: underline;
        }

        .description {
          margin: 0 0 1rem 0;
        }
      }
    }
  }
</style>
