<template>
  <ul class="tabs">
    <li
      v-for="(link, i) in links"
      :key="i"
      :class="{ active: ($route.name === link.route) }">
      <router-link :to="{ name: link.route }">
        {{ $t(link.label) }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      links: []
    }
  },
  computed: {
    ...mapGetters({
      node: 'daemonAuth/node'
    })
  },
  created () {
    this.links = [
      { route: 'daemon-services', label: 'daemon.SERVICES' }
    ]

    console.log('Current model is', this.node.market_model)

    // Only UNLISTED nodes are granded user management access
    if (this.node.market_model === 'UNLISTED') {
      this.links.push({ route: 'daemon-users', label: 'daemon.USERS' })
    }
  }
}
</script>
