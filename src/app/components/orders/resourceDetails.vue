<template>
  <div>
    <template v-if="selectedReferences">
      <div class="details" v-for="(field, j) in selectedReferences" :key="j">

        <div v-if="accessor">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESSOR') }}</label>
          </div>
          <div v-for="(a, x) in accessor" :key="x">
            <div>{{ x }}: <strong>{{ a }}</strong></div>
          </div>
        </div>

        <div v-if="field.accessReference">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESS_REFERENCE') }}</label>
          </div>
          <div class="ips items-centered">
            <label><strong>{{ field.accessReference }}</strong></label>
            <copy-to-clipboard :field="field.accessReference" button-class="button-sm"></copy-to-clipboard>
          </div>
        </div>

        <div v-if="field.accessConfig">
          <div class="label">
            <label>{{ $i18n.t('orders.ACCESS_CONFIG') }}</label>
            <copy-to-clipboard :field="field.accessConfig" button-class="button-sm"></copy-to-clipboard>
            <download :content="field.accessConfig" :file="configFileName" button-class="button-sm"></download>
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
      margin: 16px 0;
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
    height: 300px;
  }
}
.label {
  display: flex;
  align-items: center;

  label {
    margin-right: 12px;
  }
  .button {
    margin-right: 6px;
  }
}
</style>
