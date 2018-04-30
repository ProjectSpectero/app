<template>
  <div>
    <div v-if="!loading">
      <component
        :is="component"
        :node="node"
        :group="group"
        :tabs="tabs"
        :engagements="engagements"
        :ips="ips"
        :action="$route.params.action"
        @updateEngagements="updateEngagements"
      />
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import nodeAPI from '@/app/api/node.js'
import loading from '@/shared/components/loading'
import nodeEdit from './nodeEdit'

export default {
  metaInfo: {
    title: this.title
  },
  data () {
    return {
      loading: true,
      component: null,
      node: null,
      group: null,
      engagements: null,
      ips: null,
      tabs: [
        { id: 1, label: 'General details', hash: null },
        { id: 2, label: 'Engagements', hash: '#engagements' },
        { id: 3, label: 'IP Addresses', hash: '#ips' }
      ]
    }
  },
  created () {
    this.setType()
    this.fetchNode()
  },
  computed: {
    title () {
      return (this.$route.params.action === 'edit') ? 'Edit node' : 'View node'
    }
  },
  methods: {
    setType () {
      this.component = 'nodeEdit'
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
          this.error404()
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
    nodeEdit,
    loading
  }
}
</script>

<style lang="scss" scoped>

</style>
