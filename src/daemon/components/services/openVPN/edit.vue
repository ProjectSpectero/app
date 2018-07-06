<template>
  <div>
    <top title="OpenVPN Configuration">
      <button
        class="button"
        @click="askBeforeExiting">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>
    <div class="container">
      <div class="col-12">
        <form
          v-if="config"
          @submit.prevent.stop="update">

          <div
            v-for="(item, i) in config"
            :key="i"
            class="col-6 section padded">
            <p-input
              id="allowMultipleConnections"
              :value="item.allowMultipleConnectionsFromSameClient"
              v-model="item.allowMultipleConnectionsFromSameClient"
              type="checkbox"
              class="p-default p-curve">
              Allow multiple connections from the same client?
            </p-input>

            <p-input
              id="clientToClient"
              :value="item.clientToClient"
              v-model="item.clientToClient"
              type="checkbox"
              class="p-default p-curve">
              Client To Client?
            </p-input>

            <div class="listener">
              <h2>{{ $i18n.t('misc.LISTENER') }}</h2>

              <div class="input-float">
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
                <div
                  v-show="errors.has('ipAddress')"
                  class="input-error-msg">
                  {{ errors.first('ipAddress') }}
                </div>
              </div>

              <div class="input-float">
                <input
                  v-validate="rules.port"
                  id="managementPort"
                  v-model="item.listener.managementPort"
                  :class="{ 'input-error': errors.has('managementPort') }"
                  name="managementPort"
                  type="number"
                  class="input"
                  placeholder="managementPort"
                  data-vv-as="managementPort">
                <div
                  v-show="errors.has('managementPort')"
                  class="input-error-msg">
                  {{ errors.first('managementPort') }}
                </div>
              </div>

              <div class="input-float">
                <input
                  v-validate="rules.network"
                  id="network"
                  v-model="item.listener.network"
                  :class="{ 'input-error': errors.has('network') }"
                  name="network"
                  type="text"
                  class="input"
                  placeholder="network"
                  data-vv-as="network">
                <div
                  v-show="errors.has('network')"
                  class="input-error-msg">
                  {{ errors.first('network') }}
                </div>
              </div>

              <div class="input-float">
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
                <div
                  v-show="errors.has('port')"
                  class="input-error-msg">
                  {{ errors.first('port') }}
                </div>
              </div>

              <div
                v-if="protocols"
                class="form-input">
                <div class="label">
                  <label :for="item.listener.protocol">{{ $i18n.t('misc.PROTOCOL') }}</label>
                </div>
                <div class="input-with-tooltip">
                  <select v-model="item.listener.protocol">
                    <option
                      v-for="(option, i) in protocols"
                      :key="i"
                      :value="option.id">
                      {{ $i18n.t(`cloud.protocols.${option.label}`) }}
                    </option>
                  </select>

                  <tooltip id="services.topics.protocols"/>
                </div>
              </div>

              <div>
                <div
                  v-if="dhcpOptions"
                  class="form-input">
                  <div class="label">
                    <label :for="item.dhcpOptions.Item1">
                      {{ $i18n.t('services.DHCP_OPTION') }}
                    </label>
                  </div>
                  <div class="input-with-tooltip">
                    <select v-model="item.dhcpOptions.Item1">
                      <option
                        v-for="(option, i) in dhcpOptions"
                        :key="i"
                        :value="option.id">
                        {{ $i18n.t(`cloud.dhcp.${option.label}`) }}
                      </option>
                    </select>

                    <tooltip id="services.topics.dhcpOptions"/>
                  </div>
                </div>

                <div class="input-float">
                  <input
                    id="dhcp_item2"
                    v-model="item.dhcpOptions.Item2"
                    name="dhcp_item2"
                    type="text"
                    placeholder="Item 2"
                    class="input">
                </div>
              </div>

              <div
                v-if="redirectGateway"
                class="form-input">
                <div class="label">
                  <label :for="item.redirectGateway">
                    {{ $i18n.t('services.REDIRECT_GATEWAY') }}
                  </label>
                </div>

                <p-input
                  v-for="(option, i) in redirectGateway"
                  :key="i"
                  :id="`redirectGateway-${option.id}`"
                  :value="option.id"
                  v-model="item.redirectGateway[option.id]"
                  type="checkbox"
                  class="p-default p-curve">
                  {{ $i18n.t(`cloud.gateway.${option.label}`) }}
                </p-input>

                <tooltip id="services.topics.redirectGateway"/>
              </div>
            </div>

            <div class="input-float">
              <input
                v-validate="rules.maxClients"
                id="maxClients"
                v-model="item.maxClients"
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

          <div>
            <button
              :disabled="formDisable"
              type="submit"
              class="button-info">
              {{ formDisable ? 'Please wait...' : 'Update Configuration' }}
            </button>
            <button
              class="button-light right"
              @click.prevent="askBeforeExiting">Cancel</button>
          </div>
        </form>
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
import dhcp from '@/shared/helpers/dhcp'
import gateway from '@/shared/helpers/gateway'

export default {
  components: {
    top,
    tooltip
  },
  metaInfo: {
    title: 'OpenVPN Configuration'
  },
  data () {
    return {
      name: 'OpenVPN',
      config: null,
      protocols: protocols,
      dhcpOptions: dhcp,
      redirectGateway: gateway,
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
        },
        fail: error => {
          console.log(error)
        }
      })
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
