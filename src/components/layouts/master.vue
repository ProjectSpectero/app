<template>
  <div v-if="!loading" class="spectero">
    <sidebar></sidebar>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import sidebar from '@/components/common/sidebar'

export default {
  components: {
    sidebar
  },
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.spectero {
  display: flex;
  min-width: fit-content;
}
.content {
  position: relative;
  flex: 1;
}
</style>
