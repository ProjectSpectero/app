<template>
  <nav class="navbar is-fixed-top is-primary">
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        :to="{ name: 'dashboard' }"
        @click.native="toggleMenuClick">
        <div
          class="logo logo-sm"
          :class="{ 'is-pro': isPro }">
          <div
            v-if="isPro"
            class="logo-pro"/>
        </div>
      </router-link>
      <div class="navbar-burger burger" data-target="navbar-main">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div id="navbar-main" class="navbar-menu">
      <div class="navbar-start">
        <template v-if="user">
          <router-link
            class="navbar-item"
            :to="{ name: 'pro' }"
            @click.native="toggleMenuClick">
            <b-icon icon="bolt" size="is-small" /> <span class="ml-1">{{ $t('misc.PRO') }}</span>
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <router-link
              class="navbar-link"
              :to="{ name: 'nodes' }"
              :class="{'router-link-active': ['node', 'nodesGroupCreate', 'nodeGroupEdit', 'daemon', 'daemon-service-HTTPProxy', 'daemon-service-OpenVPN'].includes($route.name)}"
              @click.native="toggleMenuClick">
              <b-icon icon="server" size="is-small" /> <span class="ml-1">{{ $t('misc.NODES') }}</span>
            </router-link>
            <div class="navbar-dropdown is-boxed">
              <router-link
                class="navbar-item"
                :to="{ name: 'nodes' }"
                :class="{'router-link-active': ['node', 'nodesGroupCreate', 'nodeGroupEdit', 'daemon', 'daemon-service-HTTPProxy', 'daemon-service-OpenVPN'].includes($route.name)}"
                @click.native="toggleMenuClick">
                <b-icon icon="list" size="is-small" /> <span class="ml-1">My Nodes</span>
              </router-link>
              <router-link
                class="navbar-item"
                :to="{ name: 'downloads' }"
                @click.native="toggleMenuClick">
                <b-icon icon="cloud-download-alt" size="is-small" /> <span class="ml-1">Install Daemon</span>
              </router-link>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link
            class="navbar-item"
            :to="{ name: 'downloads' }"
            @click.native="toggleMenuClick">
            <b-icon icon="cloud-download-alt" size="is-small" /> <span class="ml-1">Install Daemon</span>
          </router-link>
        </template>
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link
            class="navbar-link"
            :to="{ name: 'market' }"
            @click.native="toggleMenuClick">
            <b-icon icon="dollar-sign" size="is-small" /> <span class="ml-1">{{ $t('misc.MARKET') }}</span>
          </router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link
              class="navbar-item"
              :to="{ name: 'cart' }"
              @click.native="toggleMenuClick">
              <b-icon icon="shopping-basket" size="is-small" /> <span class="ml-1">{{ $t('misc.CART') }}</span>
              <span
                v-if="count"
                class="count">&nbsp;({{ count }})</span>
            </router-link>
            <template v-if="user">
              <hr class="navbar-divider">
              <router-link
                class="navbar-item"
                :to="{ name: 'orders' }"
                :class="{'router-link-active': ['order', 'orderResources', 'orderInvoices'].includes($route.name)}"
                @click.native="toggleMenuClick">
                <b-icon icon="folder-open" size="is-small" /> <span class="ml-1">{{ $t('misc.ORDERS') }}</span>
              </router-link>
              <router-link
                class="navbar-item"
                :to="{ name: 'invoices' }"
                :class="{'router-link-active': ['invoice', 'checkout'].includes($route.name)}"
                @click.native="toggleMenuClick">
                <b-icon icon="file-invoice-dollar" size="is-small" /> <span class="ml-1">{{ $t('misc.INVOICES') }}</span>
              </router-link>
            </template>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link
            class="navbar-link"
            :to="{ name: 'docs' }"
            @click.native="toggleMenuClick">
            <b-icon icon="question-circle" size="is-small" /> <span class="ml-1">Help</span>
          </router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link
              class="navbar-item"
              :to="{ name: 'docs' }"
              @click.native="toggleMenuClick">
              <b-icon icon="file-alt" size="is-small" /> <span class="ml-1">Documentation</span>
            </router-link>
            <template v-if="user">
              <a
                class="navbar-item"
                :href="supportLink"
                target="_blank">
                <b-icon icon="life-ring" size="is-small" /> <span class="ml-1">{{ $t('misc.SUPPORT') }}</span>
              </a>
            </template>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <template v-if="user">
          <template v-if="isAdmin">
            <router-link
              :to="{ name: 'users-list' }"
              class="navbar-item"
              @click.native="toggleMenuClick">
              <b-icon icon="users" size="is-small" /> <span class="ml-1">{{ $t('misc.USERS') }} (Admin)</span>
            </router-link>
          </template>
          <div class="navbar-item has-dropdown is-hoverable">
            <router-link
              class="navbar-link"
              :to="{ name: 'settings' }"
              @click.native="toggleMenuClick">
              <b-icon icon="user" size="is-small" /> <span class="ml-1">{{ $t('misc.ACCOUNT') }}</span>
            </router-link>
            <div class="navbar-dropdown is-boxed">
              <router-link
                :to="{ name: 'settings' }"
                class="navbar-item"
                @click.native="toggleMenuClick">
                <b-icon icon="cog" size="is-small" /> <span class="ml-1">{{ $t('misc.SETTINGS') }}</span>
              </router-link>
              <a
                href="#logout"
                class="navbar-item"
                @click.prevent="logOut()">
                <b-icon icon="times" size="is-small" /> <span class="ml-1">{{ $t('misc.LOGOUT') }}</span>
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link
            :to="{ name: 'login', query: { redirect: '/' } }"
            :class="{'router-link-active': ['login'].includes($route.name)}"
            class="navbar-item"
            @click.native="toggleMenuClick">
            {{ $t('misc.LOGIN') }}
          </router-link>
          <router-link
            :to="{ name: 'register' }"
            class="navbar-item"
            @click.native="toggleMenuClick">
            {{ $t('misc.REGISTER') }}
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import navBarUserDropdown from './navBarUserDropdown'

export default {
  components: {
    navBarUserDropdown
  },
  data () {
    return {
      menuCollapsed: true
    }
  },
  computed: {
    ...mapGetters({
      count: 'cart/itemCount',
      user: 'appAuth/user',
      isPro: 'appAuth/isPro',
      isAdmin: 'appAuth/isAdmin',
      supportLink: 'settings/supportLink'
    })
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout'
    }),
    toggleMenu () {
      this.menuCollapsed = !this.menuCollapsed
      this.$emit('toggleMenu')
    },
    toggleMenuClick () {
      if (!this.menuCollapsed) {
        this.toggleMenu()
      }
    },
    logOut () {
      this.toggleMenuClick()

      this.daemonLogout().then(() => {
        this.appLogout().then(() => {
          this.$router.push({ name: 'login' })
        })
      })
    }
  }
}
</script>
