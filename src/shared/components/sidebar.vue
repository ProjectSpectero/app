<template>
  <div
    v-if="user"
    class="sidebar">
    <div class="menu-logo">
      <router-link :to="{ name: 'dashboard' }">
        <div
          :class="{ 'logo-pro': user.plans.indexOf('pro') > -1 }"
          class="logo logo-sm"/>
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
              <span v-if="count">({{ count }})</span>
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
    </div>
    <sidebar-dropdown/>
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
  async created () {
    await this.fetchFreshdesk()
  },
  methods: {
    ...mapActions({
      appLogout: 'appAuth/logout',
      daemonLogout: 'daemonAuth/logout'
    }),
    async fetchFreshdesk () {
      if (this.user) {
        console.warn('User found, fetching freshdesk link ...')
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
}
</script>
