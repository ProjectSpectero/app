<template>
  <div>
    <top :title="$i18n.t('nodes.EDIT_NODE')">
      <div
        slot="sub"
        class="sub">
        <div class="col-info">
          <div
            v-if="node.friendly_name"
            class="info-box">
            <h5>Name</h5>
            <p>{{ node.friendly_name }}</p>
          </div>
          <div class="info-box">
            <h5>Market Model</h5>
            <div :class="'badge'">{{ $i18n.t(`nodes.MODEL.${node.market_model}`) }}</div>
          </div>
          <div class="info-box">
            <h5>Status</h5>
            <div :class="'badge-' + node.status.toLowerCase()">{{ $i18n.t(`nodes.STATUS.${node.status}`) }}</div>
          </div>
          <div class="info-box">
            <h5>IP/Port</h5>
            <p>{{ node.ip }}:{{ node.port }}</p>
          </div>
          <div
            v-if="node.asn"
            class="info-box">
            <h5>ASN</h5>
            <p>{{ node.asn }}</p>
          </div>
          <div
            v-if="node.cc || node.city"
            class="info-box">
            <h5>Location</h5>
            <p>
              <template v-if="node.cc"><flag
                :iso="node.cc"
                :squared="false" /> {{ getCountryById(node.cc).name }}</template>
              <template v-if="node.city"> ({{ node.city }})</template>
            </p>
          </div>
        </div>
      </div>

      <tabs
        slot="tabs"
        :tabs="tabs"
        :active-tab="activeTab"
        @switchTab="switchTab"/>
    </top>

    <div class="container">
      <edit-form
        v-if="activeTab === 'general'"
        :node="node"/>
      <list-engagements
        v-else-if="activeTab === 'engagements'"
        :engagements="engagements"
        :node="node"
        @updateEngagements="updateEngagements"/>
      <div
        v-else-if="activeTab === 'ips'"
        class="col-12">
        <list-ips :ips="ips"/>
      </div>
      <list-system
        v-else-if="activeTab === 'system'"
        :node="node"/>
      <not-found v-else/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tabs from './tabs'
import editForm from './nodeEditForm'
import listEngagements from './listEngagements'
import listIps from './listIps'
import listSystem from './listSystem'
import top from '@/shared/components/top'
import notFound from '@/shared/components/404'

export default {
  components: {
    top,
    tabs,
    editForm,
    listEngagements,
    listIps,
    listSystem,
    notFound
  },
  metaInfo: {
    title: 'Edit Node'
  },
  props: {
    action: {
      type: String,
      required: true
    },
    node: {
      type: Object,
      required: true
    },
    ips: {
      type: Array,
      required: true
    },
    engagements: {
      type: Array,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeTab: ''
    }
  },
  computed: {
    ...mapGetters({
      countries: 'settings/countries'
    })
  },
  watch: {
    '$route': 'parseTab'
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
  }
}
</script>

<style lang="scss" scoped>

</style>
