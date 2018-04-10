<template>
  <div v-if="!loading" class="spectero">
    <sidebar></sidebar>
    <div class="content">
      <modals-container/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import sidebar from '@/app/components/common/sidebar'

export default {
  data () {
    return {
      loading: true
    }
  },
  created () {
    this.refreshCart()
    this.loading = false
  },
  methods: {
    ...mapActions({
      refreshCart: 'market/refreshCart'
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
