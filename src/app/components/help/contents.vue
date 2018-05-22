<template>
  <section>
    <div v-for="(page, i) in items" :key="i" class="item">
      <div class="title">
        <template v-if="page.title">{{ page.title }}</template>
        <template v-else>{{ i }}</template>
      </div>

      <contents v-if="page.topics" :items="page.topics"></contents>

      <div v-else class="description">
        <template v-if="page.description">{{ page.description }}</template>
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
      font-size: 1.75rem;
      line-height: 1.75rem;
      margin: 0 0 1rem 1rem;
    }

    .item {
      border: 1px solid $color-border;
      margin: 0 1rem 1rem 1rem;
      padding: 1rem;

      .title {
        font-size: 1.25rem;
        line-height: 1.25rem;
        margin: 0 0 1rem 0;
      }

      .item {
        border: 0;
        margin: 0;
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
