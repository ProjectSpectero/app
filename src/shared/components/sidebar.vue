<template>
  <div
    class="sidebar">
    <div class="menu-logo">
      <router-link
        :to="{ name: 'dashboard' }"
        @click.native="toggleMenuClick">
        <div
          :class="{ 'logo-pro': isPro }"
          class="logo logo-sm"/>
      </router-link>
    </div>

    <a
      :class="{ 'active': !menuCollapsed }"
      class="hamburger"
      @click="toggleMenu()">
      <span :class="{ 'icon-menu': menuCollapsed, 'icon-x': !menuCollapsed }" />
    </a>

    <div
      :class="{ 'show': !menuCollapsed }"
      class="responsive-menu-overlay" />

    <div
      :class="{ collapsed: menuCollapsed }"
      class="sidebar-menu">
      <div class="menu-items middle">
        <template v-if="user">
          <!-- <section class="nav-section">
            <ul>
              <li>
                <router-link
                  :to="{ name: 'dashboard' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-pie-chart"></span>
                  {{ $i18n.t('misc.DASHBOARD') }}
                </router-link>
              </li>
            </ul>
          </section> -->
          <section
            v-if="isAdmin"
            class="nav-section">
            <h5>{{ $i18n.t('misc.ADMIN') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'users-list' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-pie-chart"/>
                  {{ $i18n.t('misc.USERS') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <ul>
              <li>
                <router-link
                  :to="{ name: 'pro' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-zap"/>
                  {{ $i18n.t('misc.PRO') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section
            v-if="isEnterprise"
            class="nav-section">
            <h5>{{ $i18n.t('misc.ENTERPRISE') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'enterpriseOrders' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-server"/>
                  {{ $i18n.t('misc.ENTERPRISE') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <h5>{{ $i18n.t('misc.DAEMON') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'nodes' }"
                  :class="{'router-link-active': ['node', 'nodesGroupCreate', 'nodeGroupEdit', 'daemon', 'daemon-service-HTTPProxy', 'daemon-service-OpenVPN'].includes($route.name)}"
                  @click.native="toggleMenuClick">
                  <span class="icon-hard-drive"/>
                  {{ $i18n.t('misc.NODES') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'downloads' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-download-cloud"/>
                  {{ $i18n.t('misc.DOWNLOADS') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <h5>{{ $i18n.t('misc.MARKET') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'market' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-shopping-bag"/>
                  {{ $i18n.t('misc.MARKET') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'cart' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-shopping-cart"/>
                  {{ $i18n.t('misc.CART') }}
                  <span
                    v-if="count"
                    class="count">{{ count }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'orders' }"
                  :class="{'router-link-active': ['order', 'orderResources', 'orderInvoices'].includes($route.name)}"
                  @click.native="toggleMenuClick">
                  <span class="icon-briefcase"/>
                  {{ $i18n.t('misc.ORDERS') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'invoices' }"
                  :class="{'router-link-active': ['invoice', 'checkout'].includes($route.name)}"
                  @click.native="toggleMenuClick">
                  <span class="icon-dollar-sign"/>
                  {{ $i18n.t('misc.INVOICES') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <h5>{{ $i18n.t('misc.HELP') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'docs' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-help-circle"/>
                  {{ $i18n.t('misc.DOCUMENTATION') }}
                </router-link>
              </li>
              <li v-if="supportLink">
                <a
                  :href="supportLink"
                  target="_blank">
                  <span class="icon-life-buoy"/>
                  {{ $i18n.t('misc.SUPPORT') }}
                </a>
              </li>
            </ul>
          </section>
        </template>
        <template v-else>
          <section class="nav-section">
            <ul>
              <li>
                <a href="https://spectero.com">
                  <span class="icon-home"/>
                  {{ $i18n.t('misc.HOME') }}
                </a>
              </li>
              <li>
                <router-link
                  :to="{ name: 'pro' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-zap"/>
                  {{ $i18n.t('misc.PRO') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <h5>{{ $i18n.t('misc.DAEMON') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'downloads' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-download-cloud"/>
                  {{ $i18n.t('misc.DOWNLOADS') }}
                </router-link>
              </li>
            </ul>
          </section>
          <section class="nav-section">
            <h5>{{ $i18n.t('misc.ACCOUNT') }}</h5>
            <ul>
              <li>
                <router-link
                  :to="{ name: 'login', query: { redirect: '/' } }"
                  :class="{'router-link-active': ['login'].includes($route.name)}"
                  @click.native="toggleMenuClick">
                  <span class="icon-log-in"/>
                  {{ $i18n.t('misc.LOGIN') }}
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'register' }"
                  @click.native="toggleMenuClick">
                  <span class="icon-user-plus"/>
                  {{ $i18n.t('misc.REGISTER') }}
                </router-link>
              </li>
            </ul>
          </section>
        </template>
      </div>
      <sidebar-dropdown
        v-if="user"
        @toggleMenuClick="toggleMenuClick"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sidebarDropdown from './sidebarDropdown'

export default {
  components: {
    sidebarDropdown
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
      isEnterprise: 'appAuth/isEnterprise',
      isPro: 'appAuth/isPro',
      isAdmin: 'appAuth/isAdmin',
      supportLink: 'settings/supportLink'
    })
  },
  watch: {
    user: async function (u) {
      if (u) {
        await this.fetchSupportLink()
        await this.fetchPlans()
        await this.refreshCart()
      }
    }
  },
  created () {
    this.fetchSupportLink()
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout',
      fetchPlans: 'market/fetchPlans',
      refreshCart: 'cart/refresh',
      fetchSupportLink: 'settings/fetchSupportLink'
    }),
    toggleMenu () {
      this.menuCollapsed = !this.menuCollapsed
      this.$emit('toggleMenu')
    },
    toggleMenuClick () {
      if (!this.menuCollapsed) {
        this.menuCollapsed = true
      }
    }
  }
}
</script>
