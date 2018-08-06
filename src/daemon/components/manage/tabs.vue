<template>
  <ul class="tabs">
    <li
      v-for="(link, i) in links"
      :key="i"
      :class="{ active: ($route.name === link.route) }">
      <router-link :to="{ name: link.route }">
        {{ $i18n.t(link.label) }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      links: []
    }
  },
  created () {
    this.links = [
      { route: 'daemon-services', label: 'daemon.SERVICES' },
      { route: 'daemon-users', label: 'daemon.USERS' }
    ]
  }
}
</script>
