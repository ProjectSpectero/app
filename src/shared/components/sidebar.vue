<template>
  <div v-if="user" class="sidebar">
    <div class="menu-logo">
      <router-link :to="{ name: 'dashboard' }">
        <div class="logo logo-sm"></div>
      </router-link>
    </div>
    <div class="menu-items middle">
      <!-- <section class="nav-section">
        <ul>
          <li>
            <router-link :to="{ name: 'dashboard' }">
              <span class="icon-pie-chart"></span>
              {{ $i18n.t('misc.DASHBOARD') }}
            </router-link>
          </li>
        </ul>
      </section> -->
      <section v-if="user.enterprise" class="nav-section">
        <h5>{{ $i18n.t('misc.ENTERPRISE') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'orders' }">
              <span class="icon-hard-drive"></span>
              {{ $i18n.t('misc.ENTERPRISE') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.DAEMON') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'nodes' }">
              <span class="icon-hard-drive"></span>
              {{ $i18n.t('misc.NODES') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'downloads' }">
              <span class="icon-download-cloud"></span>
              {{ $i18n.t('misc.DOWNLOADS') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.MARKET') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'market' }">
              <span class="icon-shopping-bag"></span>
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
              <span class="icon-briefcase"></span>
              {{ $i18n.t('misc.ORDERS') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'invoices' }">
              <span class="icon-dollar-sign"></span>
              {{ $i18n.t('misc.INVOICES') }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="nav-section">
        <h5>{{ $i18n.t('misc.HELP') }}</h5>
        <ul>
          <li>
            <router-link :to="{ name: 'docs' }">
              <span class="icon-help-circle"></span>
              {{ $i18n.t('misc.DOCUMENTATION') }}
            </router-link>
          </li>
          <li>
            <a :href="supportLink ? supportLink : '#'" target="_blank">
              <span class="icon-life-buoy"></span>
              {{ $i18n.t('misc.SUPPORT') }}
            </a>
          </li>
        </ul>
      </section>
    </div>
    <div class="menu-items dropdown">
      <section class="current-user">
        <div @click="toggleAccountDropdown()" class="dropdown-toggle" :class="{ 'active': showAccountDropdown }">
          <div class="avatar"><span class="icon-user placeholder-icon"></span></div>
          <p>My Account <span class="icon-chevron-down toggle-icon" :class="{ 'icon-chevron-up': showAccountDropdown }"></span></p>
        </div>
        <div class="dropdown" :class="{ 'display': showAccountDropdown }">
            <ul>
              <li>
                <router-link :to="{ name: 'settings' }">
                  <span class="icon-settings"></span>
                  {{ $i18n.t('misc.SETTINGS') }}
                </router-link>
              </li>
              <li>
                <a href="#logout" @click.prevent="logOut()">
                  <span class="icon-log-out"></span>
                  {{ $i18n.t('misc.LOGOUT') }}
                </a>
              </li>
            </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import userAPI from '@/app/api/user'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      supportLink: null,
      showAccountDropdown: false
    }
  },
  async created () {
    await this.fetchFreshdesk()
  },
  computed: {
    ...mapGetters({
      count: 'cart/itemCount',
      user: 'appAuth/user'
    })
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout'
    }),
    async fetchFreshdesk () {
      if (this.user) {
        await userAPI.getSupportLink({
          success: response => {
            if (response.data.result.redirect_uri !== undefined) {
              this.supportLink = response.data.result.redirect_uri
            }
          },
          fail: error => {
            console.log(error)
          }
        })
      }
    },
    logOut () {
      this.daemonLogout().then(() => {
        console.log('Logged out from daemon')
        this.appLogout().then(() => {
          console.log('Logged out from app')
          this.$router.push({ name: 'login' })
        })
      })
    },
    toggleAccountDropdown () {
      this.showAccountDropdown = !this.showAccountDropdown
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 230px;
  height: 100vh;
  background: #28303A;
  color: $white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  ul {
    list-style: none;
  }
}
h5 {
  font-size: 90%;
  opacity: 0.3;
  margin: 0 16px 8px 16px;
  text-transform: uppercase;
}
.menu-logo {
  margin: $pad;
  flex-shrink: 0;
}
.menu-items {
  overflow-x: hidden;

  &.middle {
    flex: 1;
    overflow-y: auto;
  }
  &.dropdown {
    overflow-x: visible;
  }
  a {
    padding: 14px 16px;
    display: block;
    color: #C5D0E1;
    font-size: 15px;
    font-weight: $font-semi;
    text-decoration: none;
    border-left: 3px solid transparent;

    &:hover {
      color: $white;
    }
  }
  .active, .router-link-exact-active {
    color: $white;
    border-color: $color-brand;
    background: rgba(0,0,0,.15);
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

    border-radius: 4px;
  }
}
.nav-section {
  margin-bottom: 16px;
}
[class^="icon-"], [class*=" icon-"] {
  margin-right: 4px;
}

.current-user {
  margin: 8px;
  position: relative;

  .dropdown-toggle {
    display: flex;
    align-items: center;
    padding: 8px;
    color: #C5D0E1;
    font-weight: $font-semi;
    border-radius: 4px;
    cursor: pointer;

    &:hover, &.active {
      color: $white;
      background: rgba(0,0,0,.15);
    }
    .avatar {
      width: 32px;
      height: 32px;
      display: flex;
      margin-right: 12px;
      color: $color-primary;
      background: $color-brand;
      border-radius: 4px;
      align-items: center;
      justify-content: center;

      .placeholder-icon {
        margin-right: 0;
        font-size: 20px;
      }
    }
    p {
      flex: 1;
    }
    .toggle-icon {
      float: right;
      position: relative;
      top: 2px;
      font-size: 16px;
    }
  }
  .dropdown {
    width: 100%;
    position: absolute;
    bottom: 120%;
    left: 0;
    z-index: 2;
    color: $color-primary;
    background: darken(#252930, 4%);
    border-radius: 4px;
    display: none;

    &.display {
      display: block;
    }
    &:after {
      content: '';
      position: absolute;
      right: 14px;
      top: 100%;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid darken(#252930, 4%);
      clear: both;
    }
  }
}
</style>
