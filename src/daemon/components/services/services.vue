<template>
  <div>
    <h2>Services</h2>
    <div v-if="daemonInitialized">
      <div
        v-for="(status, service) in services"
        :key="service"
        class="service">
        <h3>{{ service }}</h3>
        <p class="status">
          {{ $i18n.t('misc.STATUS') }}: <span class="badge badge-dark">{{ status }}</span>
        </p>
        <div class="buttonActions">
          <button
            :disabled="status === 'Running'"
            :class="{ 'button-success': status !== 'Running' }"
            class="button"
            @click="start(service)">
            <span class="icon-play-circle"/> {{ $i18n.t('misc.START') }}
          </button>
          <button
            :disabled="status !== 'Running'"
            :class="{ 'button-danger': status === 'Running' }"
            class="button"
            @click="stop(service)">
            <span class="icon-stop-circle"/> {{ $i18n.t('misc.STOP') }}
          </button>

          <router-link
            :to="{ name: 'service.' + service }"
            class="button-dark right">
            <span class="icon-sliders"/> {{ $i18n.t('misc.CONFIGURE') }}
          </router-link>
        </div>
      </div>
    </div>
    <loading v-else/>
  </div>
</template>

<script>
import loading from '@/shared/components/loading'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    loading
  },
  metaInfo: {
    title: 'Services'
  },
  computed: {
    ...mapGetters({
      daemonInitialized: 'daemonAuth/initialized',
      services: 'services/services'
    })
  },
  watch: {
    daemonInitialized: function () {
      this.fetchServices()
    }
  },
  created () {
    if (this.daemonInitialized) {
      this.fetchServices()
    }
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

  p.status {
    margin-bottom: 12px;
  }
}
</style>
