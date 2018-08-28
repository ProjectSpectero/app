<template>
  <top :title="$t('daemon.MANAGE_DAEMON')">
    <router-link
      :to="{ name: 'nodes' }"
      class="button">
      {{ $t('daemon.BACK_TO_NODES') }}
    </router-link>

    <div
      slot="sub"
      class="daemon-details">
      <user-management-info v-if="node && node.market_model !== 'UNLISTED'"/>
      <user-resources-info v-if="node && node.market_model === 'UNLISTED'"/>

      <div
        v-if="user"
        class="managing-user line">
        <span class="icon-user" /> <strong>User:</strong>
        <span>{{ $t('daemon.MANAGING_AS', { id: $route.params.nodeId }) }} {{ displayName }}</span>
      </div>
      <specs/>
    </div>

    <template slot="tabs">
      <tabs/>
    </template>
  </top>
</template>

<script>
import { mapGetters } from 'vuex'
import top from '@/shared/components/top'
import specs from '@/daemon/components/common/specs'
import tabs from '@/daemon/components/manage/tabs'
import userManagementInfo from '@/daemon/components/common/userManagementInfo'
import userResourcesInfo from '@/daemon/components/common/userResourcesInfo'

export default {
  components: {
    specs,
    tabs,
    top,
    userManagementInfo,
    userResourcesInfo
  },
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user',
      node: 'daemonAuth/node',
      displayName: 'appAuth/displayName'
    })
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
