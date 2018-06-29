<template>
  <div id="app">
    <component :is="layout"/>
    <vue-progress-bar/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import auth from '@/shared/layouts/auth'
import basic from '@/shared/layouts/basic'
import error from '@/shared/layouts/error'
import master from '@/shared/layouts/master'
import daemon from '@/shared/layouts/daemon'

export default {
  name: 'Spectero',
  components: {
    auth,
    basic,
    error,
    master,
    daemon
  },
  metaInfo: {
    title: null,
    titleTemplate: (titleChunk) => {
      return (titleChunk ? `${titleChunk} - ` : '') + 'Spectero'
    }
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout'
    })
  },
  watch: {
    '$route' (to, from) {
      this.switchLayout(this.fetchLayoutFromRoute(to))
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions({
      switchLayout: 'settings/switchLayout'
    }),
    init () {
      // If we refresh the page, we need to make sure our layout is set correctly
      // before vue-router kicks in. This is just necessary on the first page load;
      // any layout changes will be handled by watching vue-router from then on.
      // If there's no specified route.meta.layout, the default 'master' layout will be used.
      this.switchLayout(this.fetchLayoutFromRoute(this.$route))
    },
    fetchLayoutFromRoute: function (route) {
      return route.meta.layout || ''
    }
  }
}
</script>

<style lang="scss">
@import '~@styles/main.scss';

#app {
  width: 100%;
  height: 100%;
}
</style>
