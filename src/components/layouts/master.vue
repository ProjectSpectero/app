<template>
  <div class="spectero">
    <bar v-if="barComponent" :barComponent="barComponent"></bar>
    <sidebar></sidebar>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import sidebar from '@/components/common/sidebar'

export default {
  computed: {
    ...mapGetters({
      barComponent: 'settings/bar'
    })
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
  margin-right: 40px;
}
</style>
