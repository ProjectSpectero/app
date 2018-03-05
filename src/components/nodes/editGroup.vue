<template>
  <div>
    <top title="Edit Group"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <div v-if="!loading">
      <edit-form v-if="activeTab === 1" :group="group"></edit-form>
      <list-orders v-else-if="activeTab === 2" :orders="orders"></list-orders>
      <list-ips v-else-if="activeTab === 3" :ips="ips"></list-ips>
      <list-services v-else :services="services"></list-services>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'
import loading from '@/components/common/loading'
import tabs from './tabs'
import editForm from './editGroupForm'
import listOrders from './listOrders'
import listServices from './listServices'
import listIps from './listIps'

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
      ips: [],
      services: [],
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

            await this.fetchExtras('Orders', this.group.id)
            await this.fetchExtras('Services', this.group.id)
            await this.fetchExtras('Ips', this.group.id)

            // Chech if the url has any anchors and load it immediately
            this.parseTab()

            this.loading = false
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
      this.$router.push({ name: 'group', params: { id: data.id }, hash: data.hash })
    },
    fetchExtras (type, id) {
      const method = nodeAPI['node' + type]
      const varName = type.toLowerCase()

      method({
        data: {
          id: id
        },
        success: response => {
          if (response.data.result) {
            this[varName] = response.data.result
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
    listOrders,
    listServices,
    listIps
  }
}
</script>
