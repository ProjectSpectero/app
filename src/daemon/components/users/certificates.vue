<template>
  <div>
    <top :title="$i18n.t('daemon.CERTIFICATES')">
      <router-link
        :to="{ name: 'daemon-users' }"
        class="button">
        {{ $i18n.t('misc.BACK') }}
      </router-link>
    </top>
    <div
      v-if="user"
      class="container">
      <div class="col-12">
        <div class="section padded">
          <div
            v-if="user.authKey"
            class="item">
            <div class="label"><label for="authKey">Username</label></div>

            <textarea
              id="authKey"
              v-model="user.authKey"
              class="input font-mono"
              readonly/>

            <copy-to-clipboard
              :field="user.authKey"
              button-class="button-sm"/>
          </div>
          <div
            v-if="user.cert"
            class="item">
            <div class="label"><label for="certificate">Certificate</label></div>

            <textarea
              id="certificate"
              v-model="user.cert"
              class="input font-mono"
              readonly/>

            <download
              :content="user.cert"
              :file="'spectero-user-certificate.pfx'"
              button-class="button-sm"/>
          </div>
          <div
            v-if="user.certKey"
            class="item">
            <div class="label"><label for="key">Certificate Key</label></div>

            <textarea
              id="key"
              v-model="user.certKey"
              class="input font-mono"
              readonly/>

            <copy-to-clipboard
              :field="user.certKey"
              button-class="button-sm"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import copyToClipboard from '@/shared/components/copyToClipboard'
import download from '@/shared/components/download'
import userAPI from '@/daemon/api/user'
import top from '@/shared/components/top'

export default {
  components: {
    copyToClipboard,
    download,
    top
  },
  metaInfo: {
    title: 'Certificates'
  },
  data () {
    return {
      user: null
    }
  },
  async created () {
    await this.fetchUser()
  },
  methods: {
    async fetchUser () {
      await userAPI.get({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.user = response.data.result
        },
        fail: e => {
          console.error(e)
          this.$router.push({ name: 'daemon' })
        }
      })
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
}
.label {
  margin-bottom: 16px;
  color: $color-dark;
  font-weight: $font-semi;
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
