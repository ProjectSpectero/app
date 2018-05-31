<template>
  <div>
    <template v-if="!error">
      <div v-if="!loading">
        <node-edit
          :node="node"
          :group="group"
          :tabs="tabs"
          :engagements="engagements"
          :ips="ips"
          :action="$route.params.action"
          @updateEngagements="updateEngagements"></node-edit>
      </div>
      <loading v-else></loading>
    </template>
    <error v-else :item="errorItem" :code="errorCode"/>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node'
import loading from '@/shared/components/loading'
import error from '@/shared/components/errors/error'
import nodeEdit from './nodeEdit'

export default {
  metaInfo: {
    title: this.title
  },
  data () {
    return {
      component: null,
      node: null,
      group: null,
      engagements: null,
      ips: null,
      tabs: [
        { id: 'general', path: 'general', label: 'GENERAL_INFO' },
        { id: 'engagements', path: 'engagements', label: 'MARKET' },
        { id: 'ips', path: 'ips', label: 'IP_ADDRESSES' },
        { id: 'system', path: 'system', label: 'SYSTEM' }
      ],
      errorItem: 'node'
    }
  },
  created () {
    this.fetchNode()
  },
  computed: {
    title () {
      return (this.$route.params.action === 'edit') ? 'Edit node' : 'View node'
    }
  },
  methods: {
    async fetchGroup (groupId) {
      await nodeAPI.group({
        data: {
          id: groupId
        },
        success: response => {
          if (response.data.result) {
            this.group = response.data.result
            this.loading = false
            this.error = false
          }
        },
        fail: (e) => {
          console.log(e)
          this.errorItem = 'group'
          this.error = true
        }
      })
    },
    async fetchNode () {
      await nodeAPI.node({
        data: {
          id: this.$route.params.id
        },
        success: async response => {
          if (response.data.result) {
            this.node = response.data.result

            await this.fetchExtras('Engagements', this.node.id)
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
          this.errorItem = 'node'
          this.error = true
        }
      })
    },
    async updateEngagements () {
      await this.fetchExtras('Engagements', this.node.id)
    },
    fetchExtras (type, id) {
      const method = nodeAPI['node' + type]
      const varName = type.toLowerCase()

      method({
        data: { id: id },
        success: response => {
          if (response.data.result) {
            this[varName] = response.data.result
            this.error = false
          }
        },
        fail: (e) => {
          console.log(e)
          this.errorCode = 400
          this.errorItem = type
          this.error = true
        }
      })
    }
  },
  components: {
    nodeEdit,
    loading,
    error
  }
}
</script>
