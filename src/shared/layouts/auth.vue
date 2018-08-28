<template>
  <div class="spectero">
    <sidebar @toggleMenu="toggleMenu"/>

    <div
      :class="{ 'show': !menuCollapsed }"
      class="responsive-menu-overlay" />

    <div class="content">
      <div class="auth">
        <div class="auth-container">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from '@/shared/components/sidebar'

export default {
  components: {
    sidebar
  },
  created () {
    console.warn('Auth layout loaded')
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
