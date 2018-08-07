<template>
  <div>
    <daemon-menu/>

    <div class="container">
      <div class="col-12">
        <div class="section padded">
          <h2>Services</h2>
          <div
            v-if="services"
            class="col-container">
            <div
              v-for="(status, service) in services"
              :key="service"
              class="service section padded col-6">
              <h3>
                {{ service }}
                <span
                  :class="{ 'badge-success': status === 'Running', 'badge-error': status === 'Halted' }"
                  class="badge">
                  {{ status }}
                </span>
              </h3>
              <div class="actions">
                <router-link
                  :to="{ name: 'daemon-service-' + service }"
                  class="button-info">
                  <span class="icon-sliders"/> {{ $i18n.t('misc.CONFIGURE') }}
                </router-link>

                <div class="right">
                  <button
                    :disabled="status === 'Running'"
                    :class="{ 'button-success': status !== 'Running' }"
                    class="button"
                    @click="start(service)">
                    <span class="icon-play"/> {{ $i18n.t('misc.START') }}
                  </button>
                  <button
                    :disabled="status !== 'Running'"
                    :class="{ 'button-danger': status === 'Running' }"
                    class="button"
                    @click="stop(service)">
                    <span class="icon-x-circle"/> {{ $i18n.t('misc.STOP') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <loading
            v-else
            text="Fetching services ..."/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import loading from '@/shared/components/loading'
import daemonMenu from '@/daemon/components/common/menu'

export default {
  components: {
    loading,
    daemonMenu
  },
  metaInfo: {
    title: 'Services'
  },
  computed: {
    ...mapGetters({
      services: 'services/services'
    })
  },
  async created () {
    await this.fetchServices()
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
  margin-bottom: 0;

  h3 {
    .badge {
      position: relative;
      top: -2px;
      margin-left: 4px;
    }
  }
  .actions {
    margin-top: $pad;
  }
}
.col-container {
  margin-left: -$pad;
}
</style>
