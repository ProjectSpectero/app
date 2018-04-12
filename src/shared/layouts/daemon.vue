<template>
  <div class="spectero daemon">
    <sidebar></sidebar>
    <div class="content">
      <modals-container/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import sidebar from '@/shared/components/sidebar'

export default {
  created () {
    this.checkLogin()
  },
  methods: {
    ...mapActions({
      checkLogin: 'daemonAuth/checkLogin'
    })
  },
  components: {
    sidebar
  }
}
</script>

<style lang="scss" scoped>
.spectero {
  display: flex;
  min-width: fit-content;
}
.content {
  height: 100vh;
  padding: $pad;
  overflow: auto;
  flex: 1;
  padding-bottom: 0;
  position: relative;
}
</style>
