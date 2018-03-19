<template>
  <div>
    <top title="Edit Group"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <div v-if="!loading">
      <edit-form v-if="activeTab === 1" :group="group"></edit-form>
      <list-engagements v-else :engagements="engagements" @updateEngagements="updateEngagements"></list-engagements>
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
import listEngagements from './listEngagements'

export default {
  metaInfo: {
    title: 'Edit Node Group'
  },
  data () {
    return {
      tabs: [
        { id: 1, label: 'General details', hash: '#details' },
        { id: 2, label: 'Engagements', hash: '#engagements' }
      ],
      activeTab: 1,
      group: null,
      engagements: [],
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

            await this.fetchEngagements(this.group.id)

            // Chech if the url has any anchors and load it immediately
            await this.parseTab()
          } else {
            console.log('wrong info')
            // this.error404()
          }
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
    },
    updateEngagements () {
      this.$emit('updateEngagements')
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
    fetchEngagements (id) {
      nodeAPI.groupEngagements({
        data: {
          id: id
        },
        success: response => {
          if (response.data.result) {
            this.engagements = response.data.result
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
    listEngagements
  }
}
</script>
