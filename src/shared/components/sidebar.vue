<template>
  <div class="sidebar">
    <div class="menu-logo">
      <router-link :to="{ name: 'dashboard' }">
        <div
          :class="{ 'logo-pro': user && user.plans.indexOf('pro') > -1 }"
          class="logo logo-sm"/>
      </router-link>
    </div>
    <div class="menu-items middle">
      <template v-if="user">
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
        <section
          v-if="isEnterprise"
          class="nav-section">
          <h5>{{ $i18n.t('misc.ENTERPRISE') }}</h5>
          <ul>
            <li>
              <router-link :to="{ name: 'enterpriseOrders' }">
                <span class="icon-hard-drive"/>
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
                :class="{'router-link-active': ['node', 'nodesGroupCreate', 'nodeGroupEdit', 'manage', 'service.HTTPProxy', 'service.OpenVPN'].includes($route.name)}">
                <span class="icon-hard-drive"/>
                {{ $i18n.t('misc.NODES') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'downloads' }">
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
              <router-link :to="{ name: 'market' }">
                <span class="icon-shopping-bag"/>
                {{ $i18n.t('misc.MARKET') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'cart' }">
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
                :class="{'router-link-active': ['order', 'orderResources', 'orderInvoices'].includes($route.name)}">
                <span class="icon-briefcase"/>
                {{ $i18n.t('misc.ORDERS') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'invoices' }"
                :class="{'router-link-active': ['invoice'].includes($route.name)}">
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
              <router-link :to="{ name: 'docs' }">
                <span class="icon-help-circle"/>
                {{ $i18n.t('misc.DOCUMENTATION') }}
              </router-link>
            </li>
            <li>
              <a
                :href="supportLink ? supportLink : '#'"
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
          </ul>
        </section>
        <section class="nav-section">
          <h5>{{ $i18n.t('misc.DAEMON') }}</h5>
          <ul>
            <li>
              <router-link :to="{ name: 'downloads' }">
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
                :class="{'router-link-active': ['login'].includes($route.name)}">
                <span class="icon-log-in"/>
                {{ $i18n.t('misc.LOGIN') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'register' }">
                <span class="icon-user-plus"/>
                {{ $i18n.t('misc.REGISTER') }}
              </router-link>
            </li>
          </ul>
        </section>
      </template>
    </div>
    <sidebar-dropdown v-if="user"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import userAPI from '@/app/api/user'
import sidebarDropdown from './sidebarDropdown'

export default {
  components: {
    sidebarDropdown
  },
  data () {
    return {
      supportLink: null
    }
  },
  computed: {
    ...mapGetters({
      count: 'cart/itemCount',
      user: 'appAuth/user',
      isEnterprise: 'appAuth/isEnterprise'
    })
  },
  watch: {
    user: async function (val) {
      await this.fetchFreshdesk()
      await this.refreshCart()
    }
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout',
      refreshCart: 'cart/refresh'
    }),
    async fetchFreshdesk () {
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
  }
}
</script>
