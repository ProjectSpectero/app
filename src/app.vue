<template>
  <div id="app">
    <component :is="layout"></component>
    <vue-progress-bar></vue-progress-bar>
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
  created () {
    this.init()
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout'
    })
  },
  methods: {
    ...mapActions({
      switchLayout: 'settings/switchLayout',
      switchBarComponent: 'settings/switchBarComponent'
    }),
    init () {
      // If we refresh the page, we need to make sure our layout is set correctly
      // before vue-router kicks in. This is just necessary on the first page load;
      // any layout changes will be handled by watching vue-router from then on.
      // If there's no specified route.meta.layout, the default 'master' layout will be used.
      this.switchLayout(this.fetchLayoutFromRoute(this.$route))

      // Update bar component if needed
      if (localStorage.getItem('specteroBar')) {
        this.switchBarComponent(localStorage.getItem('specteroBar'))
      }
    },
    fetchLayoutFromRoute: function (route) {
      return route.meta.layout || ''
    }
  },
  watch: {
    '$route' (to, from) {
      this.switchLayout(this.fetchLayoutFromRoute(to))
    }
  },
  metaInfo: {
    title: null,
    titleTemplate: (titleChunk) => {
      return (titleChunk ? `${titleChunk} - ` : '') + 'Spectero'
    }
  },
  components: {
    auth,
    basic,
    error,
    master,
    daemon
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
