<template>
  <div class="sidebar">
    <router-link :to="{ name: 'dashboard' }"><div class="logo logo-sm"></div></router-link>

    <div class="menu-items">
      <section class="nav-section">
        <ul>
          <li><router-link :to="{ name: 'dashboard' }"><span class="icon-zap"></span> Dashboard</router-link></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Orders</h5>
        <ul>
          <li><router-link :to="{ name: 'orders' }"><span class="icon-codepen"></span> Orders</router-link></li>
          <li><router-link :to="{ name: 'invoices' }"><span class="icon-credit-card"></span> Invoices</router-link></li>
          <li><router-link :to="{ name: 'nodes' }"><span class="icon-server"></span> Nodes</router-link></li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>Account</h5>
        <ul>
          <li><router-link :to="{ name: 'settings' }"><span class="icon-sliders"></span> Settings</router-link></li>

          <li @click="logMeOut">
            <a href="#"><span class="icon-user-x"></span> Logout</a>
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
