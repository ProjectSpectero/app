<template>
  <div class="app-container">
    <nav-bar @toggleMenu="toggleMenu"/>

    <div
      :class="{ 'show': !menuCollapsed }"
      class="responsive-menu-overlay" />

    <div
      :class="{ 'overlay-active': !menuCollapsed }"
      class="page-content">
      <impersonation-bar/>
      <modals-container/>
      <router-view/>
    </div>
    <help/>
  </div>
</template>

<script>
import navBar from '@/shared/components/navBar'
import help from '@/shared/components/docs/panel'
import impersonationBar from '@/shared/components/impersonating'

export default {
  components: {
    navBar,
    help,
    impersonationBar
  },
  data () {
    return {
      menuCollapsed: true
    }
  },
  methods: {
    toggleMenu () {
      this.menuCollapsed = !this.menuCollapsed
    }
  }
}
</script>
