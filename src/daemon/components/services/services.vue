<template>
  <div>
    <top title="Services"></top>
    <div class="container container-600" v-for="(status, service) in services" :key="service">
      <div class="pad">
        <h2>{{ service }}</h2>
        <p>Status: <strong>{{ status }}</strong></p>
        <div class="buttonActions">
          <button class="button" :class="{ 'button-success': status !== 'Running' }" @click="start(service)" :disabled="status === 'Running'">Start</button>
          <button class="button" :class="{ 'button-danger': status === 'Running' }" @click="stop(service)" :disabled="status !== 'Running'">Stop</button>

          <router-link :to="{ name: service }" class="button right">Configure</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import top from '@/shared/components/top'

export default {
  created () {
    this.setup()
  },
  computed: {
    ...mapGetters({
      services: 'services/services'
    })
  },
  methods: {
    ...mapActions({
      fetchServices: 'services/fetch',
      fetchIps: 'services/fetchIps',
      toggleStatus: 'services/toggleStatus'
    }),
    async setup () {
      await this.fetchServices()
    },
    start (service) {
      this.toggleStatus({ service: service, action: 'start' })
    },
    stop (service) {
      this.toggleStatus({ service: service, action: 'stop' })
    }
  },
  components: {
    top
  },
  metaInfo: {
    title: 'Services'
  }
}
</script>
