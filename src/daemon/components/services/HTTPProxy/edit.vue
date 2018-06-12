<template>
  <div>
    <top title="HTTPProxy Configuration">
      <button
        class="button"
        @click="askBeforeExiting">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>

    <div class="container">
      <div class="col-6">
        <div class="section padded">
          <form
            v-if="config"
            @submit.prevent.stop="update">
            <div class="section">
              <h2>{{ $i18n.t('services.PROXY_MODE') }}</h2>
              <select
                v-model="proxy"
                required
                @change="proxyChanged">
                <option
                  v-for="option in proxyTypes"
                  :value="option"
                  :key="option">
                  {{ option }}
                </option>
              </select>
            </div>

            <listeners
              :listeners="config.listeners"
              @update="updateListeners"/>

            <domains
              :proxy="proxy"
              :enabled="proxy === 'ExclusiveAllow'"
              :domains="config.allowedDomains"
              title="Allowed Domains"
              forbidden-message-key="services.UNABLE_TO_DISPLAY_ALLOWED_DOMAINS"
              @update="updateAllowedDomains"/>

            <domains
              :proxy="proxy"
              :enabled="proxy === 'Normal'"
              :domains="config.bannedDomains"
              title="Banned Domains"
              forbidden-message-key="services.UNABLE_TO_DISPLAY_BANNED_DOMAINS"
              @update="updateBannedDomains"/>

            <div>
              <restart
                v-if="restartNeeded"
                :service="name"/>
              <template v-else>
                <button
                  :disabled="formDisable"
                  type="submit"
                  class="button-info">
                  {{ formDisable ? 'Please wait...' : 'Update Configuration' }}
                </button>
                <button
                  class="button-light right"
                  @click.prevent="askBeforeExiting">Cancel</button>
              </template>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import serviceAPI from '@/daemon/api/service'
import top from '@/shared/components/top'
import listeners from './listeners'
import domains from './domains'
import restart from './restart'

export default {
  components: {
    top,
    listeners,
    domains,
    restart
  },
  metaInfo: {
    title: 'HTTPProxy Configuration'
  },
  data () {
    return {
      name: 'HTTPProxy',
      config: null,
      proxyTypes: ['Normal', 'ExclusiveAllow'],
      proxy: null,
      formDisable: false,
      restartNeeded: false
    }
  },
  computed: {
    ...mapGetters({
      daemonInitialized: 'daemonAuth/initialized'
    })
  },
  watch: {
    daemonInitialized: function () {
      this.setup()
    }
  },
  created () {
    if (this.daemonInitialized) {
      this.setup()
    }
  },
  methods: {
    ...mapActions({
      switchBarComponent: 'settings/switchBarComponent'
    }),
    setup () {
      serviceAPI.get({
        name: this.name,
        success: response => {
          this.config = response.data.result[0]
          this.proxy = this.config.proxyMode

          // Set the top bar to display a notification + button to restart the service
          localStorage.setItem('specteroBar', 'restartHTTPProxy')
        },
        fail: error => {
          console.log(error)
          this.$router.push({ name: 'error404' })
        }
      })
    },
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, action: 'services' } })
      }
    },
    updateListeners (listeners) {
      this.$set(this.config, 'listeners', listeners)
    },
    updateAllowedDomains (allowedDomains) {
      this.$set(this.config, 'allowedDomains', allowedDomains)
    },
    updateBannedDomains (bannedDomains) {
      this.$set(this.config, 'bannedDomains', bannedDomains)
    },
    proxyChanged () {
      this.$set(this.config, 'proxyMode', this.proxy)
    },
    update () {
      serviceAPI.update({
        name: this.name,
        data: this.config,
        success: response => {
          this.$toasted.success(this.$i18n.t('services.UPDATE_SUCCESS'))

          // Append the restart server button if needed
          if (response.data.message && response.data.message === 'SERVICE_RESTART_NEEDED') {
            this.switchBarComponent('restartHTTPProxy')
          } else {
            this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, action: 'services' } })
          }
        },
        fail: error => {
          console.log(error)
          this.$toasted.error(this.$i18n.t('services.UPDATE_ERROR'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: $pad;
  margin-bottom: $pad;
  border: 1px solid $color-border;
  border-radius: 4px;
}
</style>
