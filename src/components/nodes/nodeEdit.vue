<template>
  <div>
    <top title="Edit Node"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <edit-form v-if="activeTab === 1" :node="node"></edit-form>
    <list-orders v-else-if="activeTab === 2" :orders="orders"></list-orders>
    <list-ips v-else :ips="ips"></list-ips>
  </div>
</template>

<script>
import top from '@/components/common/top'
import tabs from './tabs'
import editForm from './nodeEditForm'
import listOrders from './listOrders'
import listIps from './listIps'

export default {
  props: {
    action: String,
    node: Object,
    nodeGroup: Object,
    ips: Array,
    orders: Array,
    tabs: Array
  },
  data () {
    return {
      loading: true,
      activeTab: 1
    }
  },
  created () {
    this.parseTab()
  },
  methods: {
    parseTab () {
      if (window.location.hash) {
        const activeTab = this.tabs.find(t => t.hash === window.location.hash)

        if (activeTab) {
          this.switchTab(activeTab.id, activeTab.hash)
        }
      }
    },
    switchTab (data) {
      this.activeTab = data.id
      this.$router.push({ name: 'node', params: { action: this.action, id: this.node.id }, hash: data.hash })
    }
  },
  components: {
    top,
    tabs,
    editForm,
    listOrders,
    listIps
  }
}
</script>
