<template>
  <div>
    <template v-if="!error">
      <div v-if="daemonInitialized">
        <top title="Remote Management">
          <router-link :to="{ name: 'nodes' }" class="button">
            {{ $i18n.t('daemon.BACK_TO_NODES') }}
          </router-link>
        </top>

        <template v-if="activeTab !== 'notFound'">
          <div v-if="user" class="managing-user">
            <div class="avatar"><span>{{ initials }}</span></div>
            <p>{{ $i18n.t('daemon.MANAGING_AS') }}: <strong>{{ displayName }}</strong></p>
          </div>

          <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>
        </template>

        <services v-if="activeTab === 'services'"></services>
        <proxies v-else-if="activeTab === 'proxies'"></proxies>
        <certificates v-else-if="activeTab === 'certificates'"></certificates>
        <not-found v-else></not-found>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import services from '@/daemon/components/services/services'
import proxies from '@/daemon/components/services/proxies'
import certificates from '@/daemon/components/users/certificates'
import tabs from './tabs'
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import notFound from '@/shared/components/404'
import error from '@/shared/components/errors/error'

export default {
  data () {
    return {
      activeTab: null,
      tabs: [
        { id: 'services', path: 'services', 'label': this.$i18n.t('daemon.SERVICES') },
        { id: 'certificates', path: 'certificates', 'label': this.$i18n.t('daemon.CERTIFICATES') }
        // { id: 'proxies', path: 'proxies', 'label': this.$i18n.t('daemon.PROXIES') }
      ]
    }
  },
  created () {
    this.parseTab()
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
  },
  watch: {
    '$route': 'parseTab'
  },
  components: {
    top,
    error,
    notFound,
    tabs,
    services,
    proxies,
    certificates,
    loading
  }
}
</script>

<style lang="scss" scoped>
.managing-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $pad;
  padding: $pad;
  border: 1px solid $color-border;
  border-radius: 4px;

  > p {
    flex: 1;
    color: $color-light;

    > strong {
      color: $color-primary;
    }
  }
  .avatar {
    width: 28px;
    height: 28px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-primary;
    background: $color-brand;
    font-size: 100%;
    line-height: 100%;
    font-weight: $font-bold;
    border-radius: 24px;
  }
}
</style>
