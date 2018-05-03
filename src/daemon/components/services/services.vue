<template>
  <div>
    <h2>Services</h2>
    <div v-if="daemonInitialized" class="service" v-for="(status, service) in services" :key="service">
      <h3>{{ service }}</h3>
      <p class="status">
        {{ $i18n.t('misc.STATUS') }}: <span class="badge badge-dark">{{ status }}</span>
      </p>
      <div class="buttonActions">
        <button class="button" :class="{ 'button-success': status !== 'Running' }" @click="start(service)" :disabled="status === 'Running'">
          {{ $i18n.t('misc.START') }}
        </button>
        <button class="button" :class="{ 'button-danger': status === 'Running' }" @click="stop(service)" :disabled="status !== 'Running'">
          {{ $i18n.t('misc.STOP') }}
        </button>

        <router-link :to="{ name: 'service.' + service }" class="button button-info right">
          {{ $i18n.t('misc.CONFIGURE') }}
        </router-link>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import loading from '@/shared/components/loading'
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
  },
  components: {
    loading
  }
}
</script>

<style lang="scss" scoped>
.service {
  max-width: 800px;
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
