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
          v-if="item.status === 'ACTIVE' && ipListFormatted !== ''"
          :button-text="'Download Proxy List'"
          :content="ipListFormatted"
          :file="`spectero-resource-${item.resource}-ips`"
          button-class="button is-small is-info"/>
      </div>
    </div>

    <div
      v-if="accessor"
      class="accessor">
      <div class="credentials">
        <div class="label">{{ $t('orders.ACCESSOR_DETAILS') }}</div>
        <p>{{ $t('misc.USERNAME') }}: <strong>{{ accessor.username }}</strong></p>
        <p>{{ $t('misc.PASSWORD') }}: <strong>{{ accessor.password }}</strong></p>
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
    order: {
      type: Object,
      required: false,
      default: () => {}
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
      let list = []

      if (this.resources) {
        this.resources.forEach(r => {
          for (let type in r.references) {
            if (r.references.hasOwnProperty(type)) {
              r.references[type].forEach(ref => {
                list.push(ref.accessReference)
              })
            }
          }
        })
      }

      return this.formatAccessReferences(list)
    }
  },
  async created () {
    // Only ACTIVE orders have valid resources
    if (this.order.status === 'ACTIVE') {
      await this.fetchResources()
    }
  },
  methods: {
    formatAccessReferences (refs) {
      let output = ''

      for (let r of refs) {
        output += `${r}\n`
      }

      return output
    }
  }
}
</script>
