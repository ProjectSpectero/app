<template>
  <div v-if="user">
    <div>
      <div class="avatar">{{ initials }}</div>
      <div class="name">{{ displayName }}</div>

      <h3>{{ $i18n.t('misc.ROLES') }}</h3>
      <div>{{ roles }}</div>
    </div>

    <router-link :to="{ name: 'services', params: { nodeId: $route.params.nodeId } }">
      Services
    </router-link>

    <router-link :to="{ name: 'proxies', params: { nodeId: $route.params.nodeId } }">
      Proxies
    </router-link>

    <router-link :to="{ name: 'certificates', params: { nodeId: $route.params.nodeId } }">
      Certificates
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user'
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
  }
}
</script>
