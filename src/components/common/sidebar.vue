<template>
  <div class="sidebar">
    <router-link :to="{ name: 'dashboard' }"><div class="logo logo-sm"></div></router-link>

    <div class="menu-items">
      <section class="nav-section">
        <ul>
          <li><router-link :to="{ name: 'dashboard' }"><span class="icon-zap"></span> Overview</router-link></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Servers</h5>
        <ul>
          <li class="active">
            <a href="#"><span class="icon-sliders"></span> Manage Server</a>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">Statistics</a></li>
            </ul>
          </li>
          <li><a href="#"><span class="icon-layers"></span> Mass Manage</a></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Marketplace</h5>
        <ul>
          <li><a href="#"><span class="icon-share-2"></span> Spectero Market</a></li>
          <li><a href="#"><span class="icon-globe"></span> Proxy Network</a></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Help</h5>
        <ul>
          <li><a href="#"><span class="icon-life-buoy"></span> Documentation</a></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Account</h5>
        <ul>
          <li><router-link :to="{ name: 'account' }">Settings</router-link></li>

          <li @click="logMeOut">
            <a href="#"><span class="icon-life-buoy"></span> Logout</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    logMeOut () {
      this.logout().then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 230px;
  height: 100%;
  background: #161A1F;
  color: $white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
}
a {
  padding: 13px $pad;
  display: block;
  color: #C5D0E1;
  font-size: 15px;
  font-weight: $font-semi;
  text-decoration: none;

  &:hover {
    color: $white;
  }
}
h5 {
  padding-left: $pad;
  padding-bottom: 8px;
  margin-bottom: 0;
  text-transform: uppercase;
}
.logo {
  margin: $pad;
  flex-shrink: 0;
}
.menu-items {
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar {
    width: 4px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $color-brand;
  }
}
.nav-section {
  margin-bottom: 16px;
}
[class^="icon-"], [class*=" icon-"] {
  margin-right: 4px;
}
.active {
  box-shadow: inset 3px 0 0 $color-brand;
  background: rgba(0,0,0,0.3);

  > a {
    color: $white;
  }
}
</style>
