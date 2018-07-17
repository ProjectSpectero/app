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
              :dhcp-items="dhcpOptions"
              @update="updateDhcp"/>

            <div v-if="gatewayOptions">
              <h5>Redirect Gateway <tooltip id="services.topics.redirectGateway"/></h5>

              <div
                v-for="(option, i) in gatewayOptions"
                :key="i"
                class="form-checkbox">
                <p-input
                  :id="`redirectGateway-${option.id}`"
                  :value="option.id"
                  v-model="config[0].redirectGateway[option.id]"
                  type="checkbox"
                  class="p-default p-curve"
                  @change="updateGateways($event, option.id)">
                  {{ $i18n.t(`cloud.gateway.${option.label}`) }}
                </p-input>
              </div>
            </div>

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
                id="ipAddress"
                v-model="item.listener.ipAddress"
                :class="{ 'input-error': errors.has('ipAddress') }"
                name="ipAddress"
                type="text"
                class="input"
                placeholder="IP Address"
                data-vv-as="IP address">
            </float-label>
            <div
              v-show="errors.has('ipAddress')"
              class="input-error-msg">
              {{ errors.first('ipAddress') }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.port"
                id="managementPort"
                v-model="item.listener.managementPort"
                :class="{ 'input-error': errors.has('managementPort') }"
                name="managementPort"
                type="number"
                class="input"
                placeholder="Management Port"
                data-vv-as="managementPort">
            </float-label>
            <div
              v-show="errors.has('managementPort')"
              class="input-error-msg">
              {{ errors.first('managementPort') }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.network"
                id="network"
                v-model="item.listener.network"
                :class="{ 'input-error': errors.has('network') }"
                name="network"
                type="text"
                class="input"
                placeholder="Network"
                data-vv-as="network">
            </float-label>
            <div
              v-show="errors.has('network')"
              class="input-error-msg">
              {{ errors.first('network') }}
            </div>
          </div>

          <div class="form-input">
            <float-label>
              <input
                v-validate="rules.port"
                id="port"
                v-model="item.listener.port"
                :class="{ 'input-error': errors.has('port') }"
                name="port"
                type="number"
                class="input"
                placeholder="Port"
                data-vv-as="port">
            </float-label>
            <div
              v-show="errors.has('port')"
              class="input-error-msg">
              {{ errors.first('port') }}
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
import { mapGetters } from 'vuex'
import serviceAPI from '@/daemon/api/service'
import top from '@/shared/components/top'
import tooltip from '@/shared/components/tooltip'
import protocols from '@/shared/helpers/protocols'
import gateway from '@/shared/helpers/gateway'
import dhcp from './dhcp'

export default {
  components: {
    top,
    tooltip,
    dhcp
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
      gatewayOptions: gateway,
      redirectGateway: [],
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
            this.redirectGateway = this.config[0].redirectGateway
          }
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    validateCIDR (value) {
      console.log(value)
    },
    updateGateways (value, id) {
      if (!value) {
        var i = this.redirectGateway.indexOf(id)

        if (i !== -1) {
          this.redirectGateway.splice(i, 1)
        }
      } else {
        this.redirectGateway.push(id)
      }
    },
    updateDhcpOptions (value, id) {
      if (!value) {
        var i = this.redirectGateway.indexOf(id)

        if (i !== -1) {
          this.redirectGateway.splice(i, 1)
        }
      } else {
        this.redirectGateway.push(id)
      }
    },
    updateDhcp (dhcp) {
      this.dhcpOptions = dhcp
    },
    update () {
      this.$set(this.config[0], 'dhcpOptions', this.dhcpOptions)
      this.$set(this.config[0], 'redirectGateway', this.redirectGateway)

      console.log('Updating with config', this.config)

      serviceAPI.update({
        name: this.name,
        data: this.config,
        success: response => {
          this.$toasted.success(this.$i18n.t('services.UPDATE_SUCCESS'))
          console.log('updated', response.data.message)

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
