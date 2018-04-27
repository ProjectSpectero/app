<template>
  <div>
    <template v-if="selectedReferences">
      <div class="details" v-for="(field, j) in selectedReferences" :key="j">
        <div v-if="accessor">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESSOR') }}</label>
          </div>
          <div v-for="(a, x) in accessor" :key="x">
            <div>{{ x }}: {{ a }}</div>
          </div>
        </div>
        <div v-if="field.accessReference">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESS_REFERENCE') }}</label>
            <copy-to-clipboard :field="field.accessReference"></copy-to-clipboard>
          </div>
          <div class="ips">
              {{ field.accessReference }}
          </div>
        </div>
        <div v-if="field.accessConfig">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESS_CONFIG') }}</label>
            <copy-to-clipboard :field="field.accessConfig"></copy-to-clipboard>
            <download :content="field.accessConfig" :file="configFileName"></download>
          </div>
          <textarea class="input" v-model="field.accessConfig" readonly></textarea>
        </div>
        <div v-if="field.accessCredentials">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESS_CREDENTIALS') }}</label>
          </div>
          <div>{{ field.accessCredentials }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <p>{{ $i18n.t('orders.NOT_ENABLED', { type: selectedType }) }}</p>
    </template>
  </div>
</template>

<script>
import copyToClipboard from '@/shared/components/copyToClipboard'
import download from '@/shared/components/download'

export default {
  props: {
    id: Number,
    type: String,
    accessor: Object,
    selectedReferences: Array,
    selectedType: String
  },
  computed: {
    configFileName () {
      return 'spectero-' + this.type.toLowerCase() + '-' + this.id + '-openvpn.ovpn'
    }
  },
  components: {
    copyToClipboard,
    download
  }
}
</script>

<style lang="scss" scoped>
  .details {
    margin-bottom: $pad;
    padding: $pad;
    border-radius: 4px;
    border: 1px solid $color-border;
    width: 80%;

    > div {
      margin-bottom: 1rem;
    }

    input, textarea {
      width: 100%;
    }

    textarea {
      height: 300px;
    }
  }
</style>
