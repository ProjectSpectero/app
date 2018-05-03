<template>
  <div>
    <top :title="$i18n.t('nodes.EDIT_NODE')"></top>

    <div class="container">
      <div class="col-info">
        <div class="info-box">
          <h5>Name</h5>
          <p>{{ node.friendly_name }}</p>
        </div>
        <div class="info-box">
          <h5>Market Model</h5>
          <div :class="'badge'">{{ $i18n.t(`nodes.MODEL.${node.market_model}`) }}</div>
        </div>
        <div class="info-box">
          <h5>Status</h5>
          <div :class="'badge status-' + node.status">{{ $i18n.t(`nodes.STATUS.${node.status}`) }}</div>
        </div>
        <div class="info-box">
          <h5>IP/Port</h5>
          <p>{{ node.ip }}:{{ node.port }}</p>
        </div>
        <div v-if="node.asn" class="info-box">
          <h5>ASN</h5>
          <p>{{ node.asn }}</p>
        </div>
        <div v-if="node.cc || node.city" class="info-box">
          <h5>Location</h5>
          <p>
            <template v-if="node.cc">{{ getCountryById(node.cc).name }}</template>
            <template v-if="node.city"> ({{ node.city }})</template>
          </p>
        </div>
        <div class="info-box">
          <h5>Price</h5>
          <p>{{ node.price | currency }} USD</p>
        </div>
      </div>
    </div>

    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <edit-form v-if="activeTab === 1" :node="node"></edit-form>
    <list-engagements v-else-if="activeTab === 2" :engagements="engagements" @updateEngagements="updateEngagements"></list-engagements>
    <list-ips v-else :ips="ips"></list-ips>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import tabs from './tabs'
import editForm from './nodeEditForm'
import listEngagements from './listEngagements'
import listIps from './listIps'
import { mapGetters } from 'vuex'

export default {
  props: {
    action: String,
    node: Object,
    nodeGroup: Object,
    ips: Array,
    engagements: Array,
    tabs: Array
  },
  data () {
    return {
      loading: true,
      activeTab: 1
    }
  },
  computed: {
    ...mapGetters({
      countries: 'settings/countries'
    })
  },
  metaInfo: {
    title: 'Edit Node'
  },
  created () {
    this.parseTab()
  },
  methods: {
    parseTab () {
      if (window.location.hash) {
        const hash = window.location.hash.toString()
        const tab = this.tabs.find(t => t.hash === hash)

        if (tab) {
          this.switchTab(tab)
        }
      } else {
        this.switchTab(this.tabs[0])
      }
    },
    updateEngagements () {
      this.$emit('updateEngagements')
    },
    switchTab (tab) {
      this.activeTab = tab.id
      this.$router.push({ name: 'node', params: { action: this.action, id: this.node.id }, hash: tab.hash })
    }
  },
  watch: {
    '$route': 'parseTab'
  },
  components: {
    top,
    tabs,
    editForm,
    listEngagements,
    listIps
  }
}
</script>

<style lang="scss" scoped>
@import '~@styles/components/badges';

.badge {
  &.status-CONFIRMED, &.status-ENABLED {
    @extend .badge-success;
  }

  &.status-UNCONFIRMED, &.status-DISABLED {
    @extend .badge-error;
  }
}
</style>
