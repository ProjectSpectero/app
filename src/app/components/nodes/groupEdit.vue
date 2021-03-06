<template>
  <div>
    <template v-if="!error">
      <top :title="$i18n.t('nodes.EDIT_GROUP')">
        <tabs
          slot="tabs"
          :tabs="tabs"
          :active-tab="activeTab"
          @switchTab="switchTab"/>
      </top>
      <div v-if="!loading">
        <div class="container">
          <edit-form
            v-if="activeTab === 'general'"
            :group="group"/>
          <list-engagements
            v-else-if="activeTab === 'engagements'"
            :group="group"
            :engagements="engagements"
            @updateEngagements="updateEngagements"/>
        </div>
      </div>
      <loading v-else/>
    </template>
    <error
      v-else
      :item="errorItem"
      :code="errorCode"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import tabs from './tabs'
import editForm from './groupForm'
import listEngagements from './listEngagements'
import top from '@/shared/components/top'
import error from '@/shared/components/errors/error'
import loading from '@/shared/components/loading'

export default {
  components: {
    top,
    error,
    loading,
    tabs,
    editForm,
    listEngagements
  },
  metaInfo: {
    title: 'Edit Node Group'
  },
  data () {
    return {
      tabs: [
        { id: 'general', path: 'general', 'label': 'GENERAL_DETAILS' },
        { id: 'engagements', path: 'engagements', 'label': 'ENGAGEMENTS' }
      ],
      activeTab: '',
      group: null,
      engagements: [],
      errorItem: 'group',
      errorCode: 404
    }
  },
  watch: {
    '$route': 'parseTab'
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
            this.error = false

            await this.fetchEngagements(this.group.id)

            // Chech if the url has any anchors and load it immediately
            await this.parseTab()
          } else {
            this.error = true
          }
        },
        fail: (e) => {
          console.log(e)
          this.error = true
          this.loading = false
        }
      })
    },
    updateEngagements () {
      this.loading = true
      this.fetchGroup(this.$route.params.id)
    },
    fetchEngagements (id) {
      nodeAPI.groupEngagements({
        data: { id: id },
        success: response => {
          this.engagements = response.data.result
          this.loading = false
          this.error = false
        },
        fail: (e) => {
          console.log(e)
          this.errorItem = 'engagements'
          this.errorCode = 400
          this.error = true
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
      this.$router.push({ name: 'nodeGroupEdit', params: { id: this.group.id, tabAction: tab.path } })
    }
  }
}
</script>
