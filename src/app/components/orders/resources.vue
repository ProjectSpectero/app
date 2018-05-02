<template>
  <div>
    <top :title="'Order '+ orderId +' Resources'">
      <router-link :to="{ name: 'order', params: { id: orderId } }" class="button">Back to Order Details</router-link>
    </top>
    <div v-if="resources && resources.length">
      <div class="content-split">
        <div class="split-item split-list nodes-sidebar">
          <div v-for="(item, index) in resources" :key="index" class="node-group" :class="{ active: selectedResource === item }" @click="selectResource(item)">
            <div class="group-name">Item {{ item.id }}</div>
            <div class="count">{{ item.type === 'NODE_GROUP' ? 'Group' : 'Node' }}</div>
          </div>
        </div>
        <div class="split-item split-details">
          <div v-if="accessor" class="details">
            <div>
              <div class="label"><label>{{ $i18n.t('orders.ACCESSOR_DETAILS') }}</label></div>
              <p>Username: <strong>{{ accessor.username }}</strong></p>
              <p>Password: <strong>{{ accessor.password }}</strong></p>
            </div>
          </div>

          <ul class="references tabs">
            <li v-for="t in types" :key="t" @click="selectReference(t)" class="reference" :class="{ active: selectedType === t }">
              <span>{{ t }}</span>
            </li>
          </ul>

          <resource-details
            :id="selectedResource.id"
            :type="selectedResource.type"
            :selectedReferences="selectedReferences"
            :selectedType="selectedType"></resource-details>
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import resourceDetails from './resourceDetails'
import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      accessor: null,
      resources: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: ['HTTPProxy', 'OpenVPN', 'ShadowSOCKS', 'SSHTunnel']
    }
  },
  metaInfo () {
    return {
      title: 'Order ' + this.orderId + ' Resources'
    }
  },
  computed: {
    orderId () {
      return this.$route.params.id
    }
  },
  created () {
    this.fetchOrder()
  },
  methods: {
    async fetchOrder () {
      await orderAPI.order({
        data: {
          id: this.$route.params.id
        },
        success: async response => {
          if (response.data.result && response.data.result.status === 'ACTIVE') {
            await this.fetchResources()
          } else {
            this.error404()
          }
        },
        fail: (e) => {
          console.log(e)
          this.error404()
        }
      })
    },
    async fetchResources () {
      await orderAPI.resources({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.accessor = response.data.result.accessor ? this.parseAccessor(response.data.result.accessor) : ''
          this.buildResourceTree(response.data.result.resources)
        },
        fail: (e) => {
          console.log(e)
          this.error404()
        }
      })
    },
    parseAccessor (accessor) {
      const data = accessor.split(':')

      if (data.length === 2) {
        return {
          username: data[0],
          password: data[1]
        }
      }

      return data
    },
    buildResourceTree (data) {
      let tree = []
      data.forEach(item => {
        tree.push({
          id: item.resource.id,
          type: item.resource.type,
          references: this.parseReferences(item.resource.reference)
        })
      })

      this.resources = tree

      tree.forEach(item => {
        this.buildResource(item)
      })

      this.selectResource(tree[0])
    },
    parseReferences (reference) {
      let data = []
      reference.forEach(r => {
        const parsed = JSON.parse(r.resource)
        data.push({
          type: r.type,
          accessReference: parsed.accessReference ? parsed.accessReference.join('\n') : '',
          accessConfig: parsed.accessConfig,
          accessCredentials: (parsed.accessCredentials === 'SPECTERO_USERNAME_PASSWORD') ? this.$i18n.t('orders.USE_ACCESSOR') : parsed.accessCredentials
        })
      })

      return data
    },
    buildResource (item) {
      let sortedReferences = {}
      let selectedType = this.types[0]

      item.references.forEach(r => {
        if (sortedReferences[r.type] === undefined) {
          sortedReferences[r.type] = []
        }

        sortedReferences[r.type].push(r)

        if (!selectedType) {
          selectedType = r.type
        }
      })

      // Update references with list sorted by type (OpenVPN, ...)
      this.$set(item, 'references', sortedReferences)
    },
    selectResource (item) {
      this.selectedResource = item
      this.selectReference(this.types[0])
    },
    selectReference (type) {
      this.selectedType = type
      this.selectedReferences = this.selectedResource.references[type]
    }
  },
  components: {
    top,
    loading,
    resourceDetails
  }
}
</script>

<style lang="scss" scoped>
.details {
  margin-bottom: $pad;
  padding: $pad;
  border-radius: 4px;
  border: 1px solid $color-border;
}
</style>
