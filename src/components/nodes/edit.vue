<template>
  <div>
    <top title="Edit Node"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <div v-if="!loading">
      <edit-form v-if="activeTab === 1" :node="node"></edit-form>
      <list-orders v-else-if="activeTab === 2" :orders="orders"></list-orders>
      <list-ips v-else-if="activeTab === 3" :ips="ips"></list-ips>
      <list-services v-else :services="services"></list-services>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import nodeAPI from '@/api/node.js'
import top from '@/components/common/top'
import loading from '@/components/common/loading'
import tabs from './tabs'
import editForm from './editForm'
import listOrders from './listOrders'
import listServices from './listServices'
import listIps from './listIps'

export default {
  metaInfo: {
    title: 'Edit Node'
  },
  data () {
    return {
      tabs: [
        { id: 1, label: 'General details', hash: '#details' },
        { id: 2, label: 'Orders', hash: '#orders' },
        { id: 3, label: 'IP Addresses', hash: '#ips' },
        { id: 4, label: 'Services', hash: '#services' }
      ],
      loading: true,
      node: null,
      activeTab: 1,
      group: null,
      ips: [],
      services: [],
      orders: []
    }
  },
  created () {
    this.fetchNode()
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  methods: {
    async fetchNode () {
      await nodeAPI.node({
        data: {
          id: this.$route.params.id
        },
        success: async response => {
          if (response.data.result) {
            this.node = response.data.result

            await this.fetchExtras('Orders', this.node.id)
            await this.fetchExtras('Services', this.node.id)
            await this.fetchExtras('Ips', this.node.id)

            // Uncategorized nodes don't have any node group so fetching ends here
            if (this.node.group_id) {
              this.fetchGroup(this.node.group_id)
            } else {
              this.loading = false
            }
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
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
      this.$router.push({ name: 'node', params: { id: data.id }, hash: data.hash })
    },
    async fetchGroup (groupId) {
      await nodeAPI.group({
        data: {
          id: groupId
        },
        success: response => {
          if (response.data.result) {
            this.group = response.data.result
            this.loading = false
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
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
