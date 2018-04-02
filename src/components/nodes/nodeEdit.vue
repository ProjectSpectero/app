<template>
  <div>
    <top title="Edit Node"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <edit-form v-if="activeTab === 1" :node="node"></edit-form>
    <list-engagements v-else-if="activeTab === 2" :engagements="engagements" @updateEngagements="updateEngagements"></list-engagements>
    <list-ips v-else :ips="ips"></list-ips>
  </div>
</template>

<script>
import top from '@/components/common/top'
import tabs from './tabs'
import editForm from './nodeEditForm'
import listEngagements from './listEngagements'
import listIps from './listIps'

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
