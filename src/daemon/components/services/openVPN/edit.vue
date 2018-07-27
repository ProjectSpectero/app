<template>
  <div>
    <top title="OpenVPN Configuration">
      <button
        class="button"
        @click="askBeforeExiting">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>
    <form v-if="config">
      <div class="container">
        <div class="col-12">
          <div class="section padded openvpn-settings">
            <div>
              <h5>Connection Settings</h5>
              <div class="form-checkbox">
                <p-input
                  id="allowMultipleConnections"
                  :value="config[0].allowMultipleConnectionsFromSameClient"
                  v-model="config[0].allowMultipleConnectionsFromSameClient"
                  type="checkbox"
                  class="p-default p-curve">
                  Allow multiple connections from same client
                </p-input>
              </div>
              <div class="form-checkbox">
                <p-input
                  id="clientToClient"
                  :value="config[0].clientToClient"
                  v-model="config[0].clientToClient"
                  type="checkbox"
                  class="p-default p-curve">
                  Allow client-to-client connections
                </p-input>
              </div>
            </div>

            <dhcp
              :current-dhcp="dhcpOptions"
              @update="updateDhcp"/>

            <gateways
              :current-gateways="redirectGateway"
              @update="updateGateways"/>

            <cidr
              :pushed-networks="pushedNetworks"
              @update="updatePushedNetworks"/>

            <div>
              <h5>Maximum Clients</h5>

              <input
                v-validate="rules.maxClients"
                id="maxClients"
                v-model="config[0].maxClients"
                :class="{ 'input-error': errors.has('maxClients') }"
                name="maxClients"
                type="number"
                class="input"
                placeholder="Max. clients"
                data-vv-as="maximum clients">
              <div
                v-show="errors.has('maxClients')"
                class="input-error-msg">
                {{ errors.first('maxClients') }}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="container pt-0 pb-0">
        <div
          v-for="(item, i) in config"
          :key="i"
          class="col-6 section padded">
          <h2>{{ $i18n.t('misc.LISTENER') + ' #' + (i+1) }}</h2>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.ipAddress"
                :id="`ipAddress-${i}`"
                v-model="item.listener.ipAddress"
                :class="{ 'input-error': errors.has(`ipAddress-${i}`) }"
                :name="`ipAddress-${i}`"
                type="text"
                class="input"
                placeholder="IP Address"
                data-vv-as="IP address">
            </float-label>
            <div
              v-show="errors.has(`ipAddress-${i}`)"
              class="input-error-msg">
              {{ errors.first(`ipAddress-${i}`) }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.port"
                :id="`managementPort-${i}`"
                v-model="item.listener.managementPort"
                :class="{ 'input-error': errors.has(`managementPort-${i}`) }"
                :name="`managementPort-${i}`"
                type="number"
                class="input"
                placeholder="Management Port"
                data-vv-as="managementPort">
            </float-label>
            <div
              v-show="errors.has(`managementPort-${i}`)"
              class="input-error-msg">
              {{ errors.first(`managementPort-${i}`) }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.network"
                :id="`network-${i}`"
                v-model="item.listener.network"
                :class="{ 'input-error': errors.has(`network-${i}`) }"
                :name="`network-${i}`"
                type="text"
                class="input"
                placeholder="Network"
                data-vv-as="network">
            </float-label>
            <div
              v-show="errors.has(`network-${i}`)"
              class="input-error-msg">
              {{ errors.first(`network-${i}`) }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.port"
                :id="`port-${i}`"
                v-model="item.listener.port"
                :class="{ 'input-error': errors.has(`port-${i}`) }"
                :name="`port-${i}`"
                type="number"
                class="input"
                placeholder="Port"
                data-vv-as="port">
            </float-label>
            <div
              v-show="errors.has(`port-${i}`)"
              class="input-error-msg">
              {{ errors.first(`port-${i}`) }}
            </div>
          </div>

          <div
            v-if="protocolOptions"
            class="form-input">
            <div class="label">
              <label :for="item.listener.protocol">{{ $i18n.t('misc.PROTOCOL') }}</label>
            </div>
            <div class="input-with-tooltip">
              <select v-model="item.listener.protocol">
                <option
                  v-for="(option, i) in protocolOptions"
                  :key="i"
                  :value="option.id">
                  {{ $i18n.t(`cloud.protocols.${option.label}`) }}
                </option>
              </select>

              <tooltip id="services.topics.protocols"/>
            </div>
          </div>
        </div>
      </div>
    </form>

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
import protocols from '@/shared/helpers/protocols'
import dhcp from './dhcp'
import gateways from './gateways'
import cidr from './cidr'

export default {
  components: {
    top,
    tooltip,
    gateways,
    dhcp,
    cidr
  },
  metaInfo: {
    title: 'OpenVPN Configuration'
  },
  data () {
    return {
      name: 'OpenVPN',
      config: null,
      protocolOptions: protocols,
      dhcpOptions: [],
      redirectGateway: [],
      pushedNetworks: [],
      formDisable: false,
      rules: {
        port: {
          required: true,
          min_value: 1024,
          max_value: 65535
        },
        maxClients: {
          min_value: 512,
          max_value: 2048
        },
        network: {
          required: true,
          regex: /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/
        },
        ipAddress: {
          required: true,
          regex: /^(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
        }
      }
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
    },
    async fetchService () {
      await serviceAPI.get({
        name: 'OpenVPN',
        success: response => {
          console.warn(response.data.result)
          this.config = response.data.result

          if (this.config.length) {
            this.dhcpOptions = this.config[0].dhcpOptions
            this.pushedNetworks = this.config[0].pushedNetworks
            this.redirectGateway = this.config[0].redirectGateway
          }
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    updatePushedNetworks (networks) {
      this.pushedNetworks = networks
      console.log('updated pushed networks to', this.pushedNetworks)
    },
    updateGateways (gateways) {
      this.redirectGateway = gateways
    },
    updateDhcp (dhcp) {
      this.dhcpOptions = dhcp
    },
    buildObject () {
      let obj = {}
      let listeners = []
      const fields = [
        'allowMultipleConnectionsFromSameClient',
        'clientToClient',
        'dhcpOptions',
        'maxClients',
        'pushedNetworks',
        'redirectGateway'
      ]

      // Attach base fields from config[0]
      for (let i = 0; i < fields.length; i++) {
        if (this.config[0].hasOwnProperty(fields[i])) {
          obj[fields[i]] = this.config[0][fields[i]]
        }
      }

      // Attach listeners and convert ports to int
      this.config.forEach(c => {
        if (c.listener) {
          let data = {
            ipAddress: c.listener.ipAddress,
            managementPort: parseInt(c.listener.managementPort),
            network: c.listener.network,
            port: parseInt(c.listener.port),
            protocol: c.listener.protocol
          }

          listeners.push(data)
        }
      })

      obj.listeners = listeners

      return obj
    },
    update () {
      let obj = null

      this.$set(this.config[0], 'dhcpOptions', this.dhcpOptions)
      this.$set(this.config[0], 'redirectGateway', this.redirectGateway)
      this.$set(this.config[0], 'pushedNetworks', this.pushedNetworks)

      obj = this.buildObject()

      console.log('Updating with config', obj)

      serviceAPI.update({
        name: this.name,
        data: obj,
        success: response => {
          this.$toasted.success(this.$i18n.t('services.UPDATE_SUCCESS'))

          // Append the restart server button if needed
          if (response.data.message && response.data.message === 'SERVICE_RESTART_NEEDED') {
            this.switchBarComponent('restartOpenVPN')
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
    askBeforeExiting () {
      if (confirm(this.$i18n.t('misc.LEAVE_CONFIRM_DIALOG'))) {
        this.$router.push({ name: 'manage', params: { nodeId: this.$route.params.nodeId, action: 'services' } })
      }
    },
    findGatewayKey (option) {
      const k = Object.keys(this.config[0].redirectGateway).find(key => {
        console.log('trying', this.config[0].redirectGateway[key], 'vs', option.id)
        console.log(this.config[0].redirectGateway[key] === option.id)
        return this.config[0].redirectGateway[key] === option.id
      })
      console.log(k)
    }
  }
}
</script>

<style lang="scss" scoped>
.openvpn-settings {
  > div {
    margin-bottom: $pad;
    padding-bottom: $pad;
    display: block;
    border-bottom: 1px dashed $color-border;

    .form-input:last-child, .form-checkbox:last-child {
      margin-bottom: 0;
    }
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border: none;
    }
  }
}
</style>
