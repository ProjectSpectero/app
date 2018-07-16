<template>
  <div v-if="config && ips">
    <top title="HTTPProxy Configuration">
      <button
        class="button"
        @click="askBeforeExiting">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>

    <div
      v-if="config"
      class="container">
      <div class="col-6">
        <div class="section padded">
          <form>
            <div class="section">
              <h2>{{ $i18n.t('services.PROXY_MODE') }}</h2>
              <div class="form-input">
                <div class="input-with-tooltip">
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
                  <tooltip id="services.topics.proxyModes"/>
                </div>
              </div>
            </div>

            <addresses
              v-if="ips.length > 0"
              :ips="ips"
              @fillAddress="fillAddress"/>

            <listeners
              :ip="addressInput"
              :listeners="config.listeners"
              @update="updateListeners"/>
          </form>
        </div>
      </div>

      <div class="col-6">
        <div class="section padded">
          <domains
            :proxy="proxy"
            :enabled="proxy === 'ExclusiveAllow'"
            :domains="config.allowedDomains || []"
            title="Allowed Domains"
            forbidden-message-key="services.UNABLE_TO_DISPLAY_ALLOWED_DOMAINS"
            @update="updateAllowedDomains"/>

          <domains
            :proxy="proxy"
            :enabled="proxy === 'Normal'"
            :domains="config.bannedDomains || []"
            title="Banned Domains"
            forbidden-message-key="services.UNABLE_TO_DISPLAY_BANNED_DOMAINS"
            @update="updateBannedDomains"/>
        </div>
      </div>
    </div>

    <div class="container pt-0">
      <div class="col-12">
        <div class="section padded">
          <button
            :disabled="formDisable"
            type="submit"
            class="button-info"
            @click.prevent="update">
            {{ formDisable ? 'Please wait...' : 'Update Configuration' }}
          </button>
          <button
            class="button-light right"
            @click.prevent="askBeforeExiting">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import serviceAPI from '@/daemon/api/service'
import top from '@/shared/components/top'
import tooltip from '@/shared/components/tooltip'
import listeners from './listeners'
import domains from './domains'
import addresses from './addresses'

export default {
  components: {
    top,
    tooltip,
    listeners,
    domains,
    addresses
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
      ips: [],
      addressInput: ''
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
    async setup () {
      await this.fetchService()
      await this.fetchIps()
    },
    async fetchService () {
      await serviceAPI.get({
        name: this.name,
        success: response => {
          console.warn(response.data.result)
          this.config = response.data.result[0]
          this.proxy = this.config.proxyMode
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    async fetchIps () {
      serviceAPI.ips({
        success: response => {
          this.ips = response.data.result
        },
        fail: error => {
          console.log(error)
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
          console.log('updated', response.data.message)

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
    },
    fillAddress (address) {
      this.addressInput = address
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
