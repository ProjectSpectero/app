<template>
  <div>
    <h2>Services</h2>
    <div v-if="daemonInitialized" class="service" v-for="(status, service) in services" :key="service">
      <h3>{{ service }}</h3>
      <p class="status">
        Status: <span class="badge badge-dark">{{ status }}</span>
      </p>
      <div class="buttonActions">
        <button class="button button-sm" :class="{ 'button-success': status !== 'Running' }" @click="start(service)" :disabled="status === 'Running'">Start</button>
        <button class="button button-sm" :class="{ 'button-danger': status === 'Running' }" @click="stop(service)" :disabled="status !== 'Running'">Stop</button>

        <router-link :to="{ name: service }" class="button right">Configure</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    if (this.daemonInitialized) {
      this.fetchServices()
    }
  },
  computed: {
    ...mapGetters({
      daemonInitialized: 'daemonAuth/initialized',
      services: 'services/services'
    })
  },
  methods: {
    ...mapActions({
      fetchServices: 'services/fetch',
      toggleStatus: 'services/toggleStatus'
    }),
    start (service) {
      this.toggleStatus({ service: service, action: 'start' })
    },
    stop (service) {
      this.toggleStatus({ service: service, action: 'stop' })
    }
  },
  watch: {
    daemonInitialized: function () {
      this.fetchServices()
    }
  },
  metaInfo: {
    title: 'Services'
  }
}
</script>

<style lang="scss" scoped>
.service {
  margin-bottom: $pad;
  padding: $pad;
  border: 1px solid $color-border;
  border-radius: 4px;

  h3 {
    font-weight: $font-semi;
  }
  p.status {
    margin-bottom: 12px;
  }
}
</style>
