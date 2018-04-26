<template>
  <div>
    <top title="Order Resources">
      <h4>Order #{{ $route.params.id }}</h4>
    </top>
    <div v-if="resources">
      <div class="content-split">
        <div class="split-item split-list filters-side">
          <div v-for="item in resources" :key="item.id" class="filter-link" :class="{ active: selectedResource === item }" @click="selectResource(item)">
            <span>Item {{ item.id }} ({{ item.type }})</span>
          </div>
        </div>
        <div class="split-item split-details">
          <div class="references">
            <div v-for="t in types" :key="t" @click="selectReference(t)" class="reference" :class="{ active: selectedType === t }">
              <span>{{ t }}</span>
            </div>
          </div>

          <template v-if="selectedReferences">
            <div class="details" v-for="(field, j) in selectedReferences" :key="j">
              <div>
                <label>Access Reference</label>
                <input type="text" class="input" v-model="field.accessReference" readonly>
              </div>
              <div>
                <label>Access Config</label>
                <textarea class="input" v-model="field.accessConfig" readonly></textarea>
              </div>
              <div>
                <label>Access Credentials</label>
                <input type="text" class="input" v-model="field.accessCredentials" readonly>
              </div>
            </div>
          </template>
          <template v-else>
            <p>{{ $i18n.t('orders.NOT_ENABLED', { type: selectedType }) }}</p>
          </template>

      <!-- <div v-for="item in resources" :key="item.id">
        <h4>Item {{ item.id }} ({{ item.resource.type }})</h4>

        <resources-list :items="parseReferences(item.resource.reference)"></resources-list>
      </div> -->
        </div>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
import top from '@/shared/components/top'
import loading from '@/shared/components/loading'
import resourcesList from '@/app/components/nodes/resourcesList'
import orderAPI from '@/app/api/order'

export default {
  data () {
    return {
      resources: null,
      selectedType: null,
      selectedResource: null,
      selectedReferences: [],
      types: ['HTTPProxy', 'OpenVPN', 'ShadowSOCKS', 'SSHTunnel']
    }
  },
  created () {
    this.fetchResources()
  },
  methods: {
    async fetchResources () {
      await orderAPI.resources({
        data: {
          id: this.$route.params.id
        },
        success: response => {
          this.buildResourceTree(response.data.result.resources)
        },
        fail: (e) => {
          console.log(e)
          // this.error404()
        }
      })
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

      console.log(tree)

      this.resources = tree
      this.selectResource(tree[0])
    },
    parseReferences (reference) {
      let data = []
      reference.forEach(r => {
        const parsed = JSON.parse(r.resource)
        data.push({
          type: r.type,
          accessReference: parsed.accessReference ? parsed.accessReference.join(',') : '',
          accessConfig: parsed.accessConfig,
          accessCredentials: parsed.accessCredentials
        })
      })

      return data
    },
    selectResource (item) {
      let sortedReferences = {}
      let selectedType = null

      this.selectedResource = item

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

      // Select first reference type by default
      this.selectReference(selectedType)
    },
    selectReference (type) {
      this.selectedType = type
      this.selectedReferences = this.selectedResource.references[type]
    }
  },
  components: {
    top,
    loading,
    resourcesList
  }
}
</script>

<style lang="scss" scoped>
  .references {
    display: flex;
    margin: 0 0 1rem;

    .reference {
      margin-right: 1rem;
      cursor: pointer;

      &.active {
        font-weight: 600;
        cursor: default;
      }
    }
  }

  .details {
    width: 60%;

    > div {
      margin-bottom: 1rem;
    }

    input, textarea {
      width: 100%;
    }

    textarea {
      height: 300px;
    }
  }
</style>
