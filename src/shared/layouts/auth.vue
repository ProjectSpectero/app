<template>
  <div class="app-container">
    <nav-bar @toggleMenu="toggleMenu"/>

    <div
      :class="{ 'show': !menuCollapsed }"
      class="responsive-menu-overlay" />

    <div class="page-content">
      <div class="auth">
        <div class="auth-container">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/shared/components/navBar'

export default {
  components: {
    navBar
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
