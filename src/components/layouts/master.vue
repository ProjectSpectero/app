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
import sidebar from '../common/sidebar'

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
  @import '../../assets/styles/_vars.scss';
</style>
