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

    <edit-form v-if="activeTab === 'general'" :node="node"></edit-form>
    <list-engagements v-else-if="activeTab === 'engagements'" :engagements="engagements" @updateEngagements="updateEngagements"></list-engagements>
    <list-ips v-else-if="activeTab === 'ips'" :ips="ips"></list-ips>
    <not-found v-else></not-found>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import notFound from '@/shared/components/404'
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
      activeTab: null
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
    updateEngagements () {
      this.$emit('updateEngagements')
    },
    parseTab () {
      let tabId = this.$route.params.tabAction
      let find = this.tabs.find(i => i.id === tabId)

      // Handles defaulting to first tab if no tab defined in route
      if (tabId === undefined) {
        this.switchTab(this.tabs[0])
      } else {
        this.activeTab = (find !== undefined) ? tabId : 'notFound'
      }
    },
    switchTab (tab) {
      this.activeTab = tab.id
      this.$router.push({ name: 'node', params: { id: this.node.id, tabAction: tab.path }, action: tab.path })
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
    listIps,
    notFound
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
