<template>
  <div>
    <template v-if="selectedReferences">
      <div class="details" v-for="(field, j) in selectedReferences" :key="j">
        <div v-if="field.accessReference">
          <div class="label"><label>{{ $i18n.t('orders.ACCESS_REFERENCE') }}</label></div>
          <div class="reference-list">
            <span>{{ formatAccessReferences(field.accessReference) }}</span>
          </div>
          <div class="ips items-centered">
            <copy-to-clipboard :field="field.accessReference" button-class="button-sm"></copy-to-clipboard>
          </div>
        </div>

        <div v-if="field.accessConfig">
          <div class="label"><label for="accessConfig">{{ $i18n.t('orders.ACCESS_CONFIG') }}</label></div>
          <textarea class="input font-mono" v-model="field.accessConfig" id="accessConfig" readonly></textarea>
          <copy-to-clipboard :field="field.accessConfig" button-class="button-sm"></copy-to-clipboard>
          <download :content="field.accessConfig" :file="configFileName" button-class="button-sm"></download>
        </div>

        <div v-if="field.accessCredentials">
          <div class="label"><label>{{ $i18n.t('orders.ACCESS_CREDENTIALS') }}</label></div>
          <div>{{ field.accessCredentials }}</div>
        </div>
      </div>
    </template>
    <error v-else header="Not Enabled" :msg="$i18n.t('orders.NOT_ENABLED', { type: selectedType })"></error>
  </div>
</template>

<script>
import error from '@/shared/components/error'
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
  methods: {
    formatAccessReferences (ref) {
      let output = ''
      for (let r of ref.split(',')) {
        output += `${r}\n`
      }
      return output
    }
  },
  components: {
    error,
    copyToClipboard,
    download
  }
}
</script>

<style lang="scss" scoped>
.details {
  max-width: 800px;
  margin-bottom: $pad;
  padding: $pad;
  border-radius: 4px;
  border: 1px solid $color-border;

  > div {
    margin-bottom: 1rem;

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

  input, textarea {
    width: 100%;
  }

  textarea {
    min-height: 140px;
  }
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

  span {
    white-space: pre-wrap;
  }
}
textarea, .reference-list {
  margin-bottom: 12px;
}
</style>
