<template>
  <div>
    <top title="Edit Group"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <div v-if="!loading">
      <edit-form v-if="activeTab === 1" :group="group"></edit-form>
      <list-orders v-else :orders="orders"></list-orders>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'
import loading from '@/components/common/loading'
import tabs from './tabs'
import editForm from './groupEditForm'
import listOrders from './listOrders'

export default {
  metaInfo: {
    title: 'Edit Node Group'
  },
  data () {
    return {
      tabs: [
        { id: 1, label: 'General details', hash: '#details' },
        { id: 2, label: 'Orders', hash: '#orders' }
      ],
      activeTab: 1,
      group: null,
      orders: [],
      loading: true
    }
  },
  created () {
    this.fetchGroup(this.$route.params.id)
  },
  methods: {
    async fetchGroup (groupId) {
      await nodeAPI.group({
        data: {
          id: groupId
        },
        success: async response => {
          if (response.data.result) {
            this.group = response.data.result

            await this.fetchOrders(this.group.id)

            // Chech if the url has any anchors and load it immediately
            await this.parseTab()
          } else {
            this.error404()
          }
        },
        fail: () => this.error404()
      })
    },
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
      this.$router.push({ name: 'group', params: { id: this.group.id }, hash: data.hash })
    },
    fetchOrders (id) {
      nodeAPI.groupOrders({
        data: {
          id: id
        },
        success: response => {
          if (response.data.result) {
            this.orders = response.data.result
            this.loading = false
          }
        },
        fail: (e) => {
          console.log(e)
        }
      })
    }
  },
  components: {
    top,
    loading,
    tabs,
    editForm,
    listOrders
  }
}
</script>
