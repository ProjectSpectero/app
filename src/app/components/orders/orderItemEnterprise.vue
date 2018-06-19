<template>
  <div
    v-if="showDetails"
    class="details">

    <div class="items">
      <div class="price">
        <h6>Price</h6>
        <p>{{ item.quantity }} x {{ item.amount | currency }}</p>
      </div>
      <div class="price">
        <h6>Total Cost</h6>
        <p>{{ item.amount * item.quantity | currency }}</p>
      </div>
      <div
        v-if="item.sync_timestamp"
        class="date">
        <h6>Last Sync</h6>
        <p>{{ item.sync_timestamp | moment('from') }}</p>
      </div>

      <div class="actions">
        <download
          :content="ipListFormatted"
          :file="`spectero-resource-${item.resource}-ips`"
          button-class="button-sm button-info"/>
      </div>
    </div>

    <div
      v-if="accessor"
      class="accessor">
      <div class="credentials">
        <div class="label">{{ $i18n.t('orders.ACCESSOR_DETAILS') }}</div>
        <p>{{ $i18n.t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
        <p>{{ $i18n.t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>
      </div>
    </div>

  </div>
</template>

<script>
import download from '@/shared/components/download'
import resourcesMixin from '@/app/mixins/resources'
import resourceDetails from './resourceDetails'

export default {
  components: {
    download,
    resourceDetails
  },
  mixins: [
    resourcesMixin
  ],
  props: {
    item: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    showDetails: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ipListFormatted () {
      return ''
    }
  },
  created () {
    this.fetchResources()
  }
}
</script>

<style lang="scss" scoped>

</style>
