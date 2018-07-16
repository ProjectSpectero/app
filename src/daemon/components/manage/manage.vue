<template>
  <div>
    <template v-if="!error">
      <div v-if="daemonInitialized">
        <top :title="$i18n.t('daemon.MANAGE_DAEMON')">
          <router-link
            :to="{ name: 'nodes' }"
            class="button">
            {{ $i18n.t('daemon.BACK_TO_NODES') }}
          </router-link>

          <div
            v-if="activeTab !== 'notFound'"
            slot="sub"
            class="daemon-details">
            <div
              v-if="user"
              class="managing-user line">
              <span class="icon-user" /> <strong>User:</strong>
              <span>{{ $i18n.t('daemon.MANAGING_AS', { id: $route.params.nodeId }) }} {{ displayName }}</span>
            </div>
            <specs/>
          </div>

          <tabs
            v-if="activeTab !== 'notFound'"
            slot="tabs"
            :tabs="tabs"
            :active-tab="activeTab"
            @switchTab="switchTab"/>
        </top>

        <div class="container">
          <div class="col-12">
            <div class="section padded">
              <services v-if="activeTab === 'services'"/>
              <proxies v-else-if="activeTab === 'proxies'"/>
              <certificates v-else-if="activeTab === 'certificates'"/>
              <not-found v-else/>
            </div>
          </div>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import specs from '@/daemon/components/common/specs'
import services from '@/daemon/components/services/services'
import proxies from '@/daemon/components/services/proxies'
import certificates from '@/daemon/components/users/certificates'
import tabs from './tabs'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/404'
import error from '@/shared/components/errors/error'

export default {
  components: {
    top,
    specs,
    error,
    notFound,
    tabs,
    services,
    proxies,
    certificates,
    loading
  },
  data () {
    return {
      activeTab: '',
      tabs: [
        { id: 'services', path: 'services', 'label': this.$i18n.t('daemon.SERVICES') },
        { id: 'certificates', path: 'certificates', 'label': this.$i18n.t('daemon.CERTIFICATES') }
        // { id: 'proxies', path: 'proxies', 'label': this.$i18n.t('daemon.PROXIES') }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user',
      daemonInitialized: 'daemonAuth/initialized'
    }),
    displayName () {
      return this.user.fullName ? this.user.fullName : this.user.authKey
    },
    initials () {
      const initials = this.displayName.match(/\b\w/g) || []
      return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
    },
    roles () {
      return this.user.roles.join(', ')
    }
  },
  watch: {
    '$route': 'parseTab'
  },
  created () {
    this.parseTab()
  },
  methods: {
    parseTab () {
      let tabId = this.$route.params.tabAction
      let find = this.tabs.find(i => i.id === tabId)

      // Handles defaulting to first tab if no tab defined in route
      if (tabId === undefined) {
        this.switchTab(this.tabs[0])
      } else {
        this.activeTab = (find !== undefined) ? tabId : 'notFound'
      }
    },
    switchTab (tab) {
      this.activeTab = tab.id
      this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, tabAction: tab.path } })
    }
  }
}
</script>

<style lang="scss" scoped>
.managing-user {
  > p {
    flex: 1;
    color: $color-light;

    > strong {
      color: $color-primary;
    }
  }
}
</style>
