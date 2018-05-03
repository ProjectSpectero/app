<template>
  <div>
    <h2>Certificates</h2>

    <div v-if="user" class="container">
      <div class="item">
        <div class="label"><label for="authKey">Username</label></div>
        <textarea class="input font-mono" id="authKey" v-model="user.authKey" readonly></textarea>
        <copy-to-clipboard :field="user.authKey" button-class="button-sm"></copy-to-clipboard>
      </div>
      <div class="item">
        <div class="label"><label for="certificate">Certificate</label></div>
        <textarea class="input font-mono" id="certificate" v-model="user.cert" readonly></textarea>
        <download :content="user.cert" :file="'spectero-user-certificate.pfx'" button-class="button-sm"></download>
      </div>
      <div class="item">
        <div class="label"><label for="key">Certificate Key</label></div>
        <textarea class="input font-mono" id="key" v-model="user.certKey" readonly></textarea>
        <copy-to-clipboard :field="user.certKey" button-class="button-sm"></copy-to-clipboard>
      </div>
    </div>
  </div>
</template>

<script>
import copyToClipboard from '@/shared/components/copyToClipboard'
import download from '@/shared/components/download'
import { mapGetters } from 'vuex'

export default {
  metaInfo: {
    title: 'Certificates'
  },
  computed: {
    ...mapGetters({
      user: 'daemonAuth/user'
    })
  },
  components: {
    copyToClipboard,
    download
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
