<template>
  <div>
    <h2>Certificates</h2>

    <div
      v-if="user">

      <template v-if="services">
        <div
          v-for="(service, key) in services"
          :key="key"
          class="container details">
          <h3>{{ key }}</h3>

          <div
            v-if="service.accessReference"
            class="item">
            <div class="label"><label>{{ $i18n.t('orders.ACCESS_REFERENCE') }}</label></div>

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
              <label for="accessConfig">{{ $i18n.t('orders.ACCESS_CONFIG') }}</label>
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
            v-if="service.accessCredentials"
            class="item">
            <div class="label">
              <label>{{ $i18n.t('orders.ACCESS_CREDENTIALS') }}</label>
            </div>
            <div>{{ service.accessCredentials }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userAPI from '@/daemon/api/user'
import copyToClipboard from '@/shared/components/copyToClipboard'
import download from '@/shared/components/download'

export default {
  components: {
    copyToClipboard,
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
      user: 'daemonAuth/user',
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
  created () {
    if (this.user) {
      this.fetchServices()
    }

    if (this.specs) {
      this.setConfigFileName()
    }
  },
  methods: {
    setConfigFileName () {
      const id = (this.specs.cloud) ? this.specs.cloud.id : 'item'
      this.configFileName = 'spectero-' + id + '-openvpn.ovpn'
    },
    async fetchServices (service) {
      console.log('fetchService')
      await userAPI.getServices({
        data: {
          id: this.user.id
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
      return ref ? ref.join(',') : null
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

textarea {
  min-height: 140px;
  margin-bottom: 12px;
}
</style>
