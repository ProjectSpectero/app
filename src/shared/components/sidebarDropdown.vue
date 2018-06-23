<template>
  <div
    ref="sidebarDropdown"
    class="menu-items dropdown">
    <section class="current-user">
      <div
        :class="{ 'active': showAccountDropdown }"
        class="dropdown-toggle"
        @click="toggleAccountDropdown()">
        <div class="avatar"><span class="icon-user placeholder-icon"/></div>
        <p>My Account <span
          :class="{ 'icon-chevron-up': showAccountDropdown }"
          class="icon-chevron-down toggle-icon"/></p>
      </div>
      <div
        :class="{ 'display': showAccountDropdown }"
        class="dropdown">
        <ul>
          <li>
            <router-link
              :to="{ name: 'settings' }"
              @click.native="toggleAccountDropdown">
              <span class="icon-settings"/>
              {{ $i18n.t('misc.SETTINGS') }}
            </router-link>
          </li>
          <li>
            <a
              href="#logout"
              @click.prevent="logOut()">
              <span class="icon-log-out"/>
              {{ $i18n.t('misc.LOGOUT') }}
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      showAccountDropdown: false
    }
  },
  created () {
    document.addEventListener('click', this.documentClick)
  },
  destroyed () {
    document.removeEventListener('click', this.documentClick)
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout'
    }),
    logOut () {
      this.daemonLogout().then(() => {
        this.appLogout().then(() => {
          this.$router.push({ name: 'login' })
        })
      })
    },
    toggleAccountDropdown () {
      this.showAccountDropdown = !this.showAccountDropdown
    },
    documentClick (e) {
      let el = this.$refs.sidebarDropdown

      // This will hide the account dropdown when you click outside of it on the document
      if (el !== e.target && !el.contains(e.target)) {
        this.showAccountDropdown = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
