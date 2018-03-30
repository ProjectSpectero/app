<template>
  <div class="sidebar">
    <div class="menu-logo">
      <router-link :to="{ name: 'dashboard' }">
        <div class="logo logo-sm"></div>
      </router-link>
    </div>
    <div class="menu-items">
      <section class="nav-section">
        <ul>
          <li>
            <router-link :to="{ name: 'dashboard' }">
              <span class="icon-pie-chart"></span>
              {{ $i18n.t('misc.DASHBOARD') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.MARKET') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'market' }">
              <span class="icon-globe"></span>
              {{ $i18n.t('misc.MARKET') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'cart' }">
              <span class="icon-shopping-cart"></span>
              {{ $i18n.t('misc.CART') }}
              <span v-if="count">({{ count }})</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'orders' }">
              <span class="icon-codepen"></span>
              {{ $i18n.t('misc.ORDERS') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.DAEMON') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'nodes' }">
              <span class="icon-server"></span>
              {{ $i18n.t('misc.NODES') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'downloads' }">
              <span class="icon-download"></span>
              {{ $i18n.t('misc.DOWNLOADS') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.ACCOUNT') }}</h5>
        <ul>
          <li>
            <a :href="freshdeskUrl ? freshdeskUrl : '#'" target="_blank">
              <span class="icon-life-buoy"></span>
              {{ $i18n.t('misc.SUPPORT') }}
            </a>
          </li>
          <li>
            <router-link :to="{ name: 'settings' }">
              <span class="icon-sliders"></span>
              {{ $i18n.t('misc.SETTINGS') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'invoices' }">
              <span class="icon-credit-card"></span>
              {{ $i18n.t('misc.INVOICES') }}
            </router-link>
          </li>
          <li>
            <a href="#logout" @click="logMeOut">
              <span class="icon-user-x"></span>
              {{ $i18n.t('misc.LOGOUT') }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      supportLink: null
    }
  },
  computed: {
    ...mapGetters({
      freshdeskUrl: 'auth/freshdeskUrl',
      count: 'market/cartCounter'
    })
  },
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
  height: 100vh;
  background: #161A1F;
  color: $white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
h5 {
  padding-left: $pad;
  padding-bottom: 8px;
  margin-bottom: 0;
  text-transform: uppercase;
}
.menu-logo {
  margin: $pad;
  flex-shrink: 0;
}
.menu-items {
  overflow-x: hidden;
  overflow-y: auto;

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
