<template>
  <div>
    <top :title="$i18n.t('nodes.EDIT_GROUP')"></top>
    <tabs :tabs="tabs" :activeTab="activeTab" @switchTab="switchTab"></tabs>

    <div v-if="!loading">
      <edit-form v-if="activeTab === 'general'" :group="group"></edit-form>
      <list-engagements v-else-if="activeTab === 'engagements'" :engagements="engagements" @updateEngagements="updateEngagements"></list-engagements>
      <not-found v-else></not-found>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node.js'
import top from '@/shared/components/top'
import notFound from '@/shared/components/404'
import loading from '@/shared/components/loading'
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
        { id: 'general', path: 'general', 'label': 'General Details' },
        { id: 'engagements', path: 'engagements', 'label': 'Engagements' }
      ],
      activeTab: null,
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
      this.$router.push({ name: 'groupEdit', params: { id: this.group.id, tabAction: tab.path } })
    }
  },
  watch: {
    '$route': 'parseTab'
  },
  components: {
    top,
    loading,
    tabs,
    editForm,
    listEngagements,
    notFound
  }
}
</script>
