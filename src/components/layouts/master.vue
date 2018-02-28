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
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loading = false
  },
  components: {
    sidebar
  }
}
</script>

<style lang="scss" scoped>
.spectero {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.content {
  width: 100%;
  margin-left: 230px;
}
</style>
