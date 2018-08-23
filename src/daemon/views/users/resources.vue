<template>
  <div>
    <top :title="$t('daemon.RESOURCES')">
      <router-link
        :to="{ name: 'daemon-users' }"
        class="button">
        {{ $t('misc.BACK') }}
      </router-link>
    </top>

    <div
      v-if="services"
      class="container">
      <div class="col-12">
        <div class="section padded">
          <div
            v-for="(service, key) in services"
            :key="key"
            class="container details">
            <h3>{{ key }}</h3>

            <div
              v-if="service.accessReference"
              class="item">
              <div class="label"><label>{{ $t('orders.ACCESS_REFERENCE') }}</label></div>

              <div class="reference-list">
                <span>{{ formatAccessReferences(service.accessReference) }}</span>
              </div>
              <div class="ips items-centered">
                <copy-to-clipboard
                  :field="formatAccessReferences(service.accessReference)"
                  :service="service.accessReference"
                  button-class="button-sm"/>
              </div>
            </div>

            <div
              v-if="service.accessConfig"
              class="item">
              <div class="label">
                <label for="accessConfig">{{ $t('orders.ACCESS_CONFIG') }}</label>
              </div>

              <textarea
                :id="key + '-' + service.accessConfig"
                v-model="service.accessConfig"
                class="input font-mono"
                readonly/>
              <copy-to-clipboard
                :field="key + '-' + service.accessConfig"
                :service="service.accessConfig"
                button-class="button-sm"/>
              <download
                :content="service.accessConfig"
                :file="configFileName"
                button-class="button-sm"/>
            </div>

            <div
              class="item">
              <div class="label">
                <label>{{ $t('orders.ACCESS_CREDENTIALS') }}</label>
              </div>

              <template v-if="service.accessCredentials">
                <div
                  v-if="service.accessCredentials === 'SPECTERO_USERNAME_PASSWORD'"
                  class="message">
                  Please create a local user and use the specified credentials to log in.
                </div>
                <div v-else-if="key === 'OpenVPN'">
                  {{ service.accessCredentials }}

                  <div class="message mt-3">
                    This is this local user's certificate encryption password.
                  </div>
                </div>
                <div
                  v-else
                  class="mb-3">
                  {{ service.accessCredentials }}
                </div>
              </template>
              <div
                v-else
                class="message">
                Please use your local user's credentials to log in.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userAPI from '@/daemon/api/user'
import copyToClipboard from '@/shared/components/copyToClipboard'
import download from '@/shared/components/download'
import top from '@/shared/components/top'

export default {
  components: {
    copyToClipboard,
    top,
    download
  },
  metaInfo: {
    title: 'My resources'
  },
  data () {
    return {
      services: null,
      configFileName: 'spectero.ovpn'
    }
  },
  computed: {
    ...mapGetters({
      specs: 'daemonAuth/specs'
    })
  },
  watch: {
    user: function (val) {
      this.fetchServices()
    },
    specs: function (val) {
      this.setConfigFileName()
    }
  },
  async created () {
    await this.fetchServices()

    if (this.specs) {
      this.setConfigFileName()
    }
  },
  methods: {
    setConfigFileName () {
      const id = (this.specs.cloud) ? this.specs.cloud.id : 'item'
      this.configFileName = 'spectero-' + id + '-openvpn.ovpn'
    },
    async fetchServices () {
      await userAPI.getServices({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          console.log(response.data.result)
          this.services = response.data.result
        },
        fail: error => {
          console.log(error)
        }
      })
    },
    formatAccessReferences (ref) {
      let output = ''

      for (let r of ref) {
        output += `${r}\n`
      }

      return output
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 800px;
  padding: $pad;
  border: 1px solid $color-border;
  border-radius: 4px;
  margin-bottom: $pad * 2;
}

.label {
  margin-bottom: 16px;
  color: $color-dark;
  font-weight: $font-semi;
}

.reference-list {
  padding: 12px;
  display: block;
  height: 140px;
  max-height: 140px;
  font-size: 14px;
  line-height: 140%;
  border: 1px solid $color-border;
  border-radius: 4px;
  overflow-y: auto;
  margin-bottom: $pad;

  span {
    white-space: pre-wrap;
  }
}

.item {
  margin-bottom: $pad;

  &:after {
    width: 100%;
    height: 1px;
    display: block;
    margin: $pad 0;
    background-color: $color-border;
    content: '';
  }
  &:last-child {
    margin-bottom: 0;

    &:after {
      display: none;
    }
  }
}

small {
  color: $color-light;
}

textarea {
  min-height: 140px;
  margin-bottom: 12px;
}
</style>
