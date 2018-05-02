<template>
  <div>
    <top title="Edit Service">
      <button @click="askBeforeExiting" class="button">
        {{ $i18n.t('misc.CANCEL') }}
      </button>
    </top>

    <form v-if="config" @submit.prevent.stop="update">
      <div class="container container-600">
        <div class="pad">
          <h2>{{ $i18n.t('services.PROXY_MODE') }}</h2>
          <select v-model="proxy" @change="proxyChanged" required>
            <option v-for="option in proxyTypes" :value="option" :key="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <listeners :listeners="config.listeners" @update="updateListeners"></listeners>

      <domains
        :proxy="proxy"
        title="Allowed domains"
        forbiddenMessageKey="services.UNABLE_TO_DISPLAY_ALLOWED_DOMAINS"
        :enabled="proxy === 'ExclusiveAllow'"
        :domains="config.allowedDomains"
        @update="updateAllowedDomains">
      </domains>

      <domains
        :proxy="proxy"
        title="Banned domains"
        forbiddenMessageKey="services.UNABLE_TO_DISPLAY_BANNED_DOMAINS"
        :enabled="proxy === 'Normal'"
        :domains="config.bannedDomains"
        @update="updateBannedDomains">
      </domains>

      <div class="container container-600">
        <div class="pad">
          <button type="submit" class="button button-info" :disabled="formDisable">
            {{ formDisable ? 'Please wait...' : 'Update Configuration' }}
          </button>

          <restart v-if="restartNeeded" :service="name"></restart>

          <button class="button button-light right" @click.prevent="askBeforeExiting">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import serviceAPI from '../../../api/service'
import top from '@/shared/components/top'
import listeners from './listeners'
import domains from './domains'

export default {
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
  async created () {
    await this.setup()
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
          this.$toasted.show(this.$i18n.t('services.UPDATE_SUCCESS'))

          // Append the restart server button if needed
          if (response.data.message && response.data.message === 'SERVICE_RESTART_NEEDED') {
            this.switchBarComponent('restartHTTPProxy')
          }
        },
        fail: error => {
          console.log(error)
          this.$toasted.error(this.$i18n.t('services.UPDATE_ERROR'))
        }
      })
    }
  },
  components: {
    top,
    listeners,
    domains
  },
  metaInfo: {
    title: 'Edit Service'
  }
}
</script>

<style lang="scss" scoped>
  // @import '../../../assets/styles/_vars.scss';

  // .list-item {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding: 8px;

  //   &:nth-child(2n-1) {
  //     background: #F7F7F7;
  //   }
  // }
  // .list-add-item {
  //   display: flex;
  //   margin-bottom: $pad;

  //   .input {
  //     width: auto;
  //     flex: 1;
  //     margin-right: 12px;
  //   }
  // }
  // .cannot-edit-message {
  //   margin-bottom: $pad;
  //   color: $color-dark;
  // }
</style>
